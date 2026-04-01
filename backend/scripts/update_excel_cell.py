#!/usr/bin/env python3

import argparse
import os
import re
import sys
import tempfile
import xml.etree.ElementTree as ET
import zipfile

MAIN_NS = "http://schemas.openxmlformats.org/spreadsheetml/2006/main"
REL_NS = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
PACKAGE_REL_NS = "http://schemas.openxmlformats.org/package/2006/relationships"
XML_NS = "http://www.w3.org/XML/1998/namespace"

ET.register_namespace("", MAIN_NS)
ET.register_namespace("r", REL_NS)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--workbook", required=True)
    parser.add_argument("--sheet", required=True)
    parser.add_argument("--cell", required=True)
    parser.add_argument("--value", required=True)
    args = parser.parse_args()

    try:
        update_excel_cell(args.workbook, args.sheet, args.cell, args.value)
    except Exception as error:
        print(str(error), file=sys.stderr)
        return 1

    return 0


def update_excel_cell(workbook_path: str, sheet_name: str, cell_reference: str, value: str) -> None:
    with zipfile.ZipFile(workbook_path, "r") as workbook_zip:
        sheet_path = resolve_sheet_path(workbook_zip, sheet_name)
        sheet_root = ET.fromstring(workbook_zip.read(sheet_path))

        row_number = extract_row_number(cell_reference)
        row = find_or_create_row(sheet_root, row_number)
        cell = find_or_create_cell(row, cell_reference)
        write_cell_value(cell, value)

        updated_sheet = ET.tostring(
            sheet_root,
            encoding="utf-8",
            xml_declaration=True,
        )

        write_archive(workbook_path, sheet_path, updated_sheet)


def resolve_sheet_path(workbook_zip: zipfile.ZipFile, sheet_name: str) -> str:
    workbook_root = ET.fromstring(workbook_zip.read("xl/workbook.xml"))
    relationships_root = ET.fromstring(workbook_zip.read("xl/_rels/workbook.xml.rels"))

    relationship_targets = {
        relationship.attrib["Id"]: relationship.attrib["Target"]
        for relationship in relationships_root.findall(f"{{{PACKAGE_REL_NS}}}Relationship")
    }

    for sheet in workbook_root.findall(f".//{{{MAIN_NS}}}sheet"):
        if sheet.attrib.get("name") != sheet_name:
            continue

        relationship_id = sheet.attrib.get(f"{{{REL_NS}}}id", "")
        target = relationship_targets.get(relationship_id)

        if target:
            return f"xl/{target.lstrip('/')}"

    raise ValueError(f"Onglet '{sheet_name}' introuvable")


def find_or_create_row(sheet_root: ET.Element, row_number: int) -> ET.Element:
    sheet_data = sheet_root.find(f"{{{MAIN_NS}}}sheetData")

    if sheet_data is None:
        raise ValueError("Feuille Excel invalide: sheetData introuvable")

    for row in sheet_data.findall(f"{{{MAIN_NS}}}row"):
        if int(row.attrib.get("r", "0")) == row_number:
            return row

    new_row = ET.Element(f"{{{MAIN_NS}}}row", {"r": str(row_number)})
    existing_rows = sheet_data.findall(f"{{{MAIN_NS}}}row")

    for index, row in enumerate(existing_rows):
        if int(row.attrib.get("r", "0")) > row_number:
            sheet_data.insert(index, new_row)
            return new_row

    sheet_data.append(new_row)
    return new_row


def find_or_create_cell(row: ET.Element, cell_reference: str) -> ET.Element:
    target_column = extract_column_letters(cell_reference)

    for cell in row.findall(f"{{{MAIN_NS}}}c"):
        if cell.attrib.get("r") == cell_reference:
            return cell

    new_cell = ET.Element(f"{{{MAIN_NS}}}c", {"r": cell_reference})
    existing_cells = row.findall(f"{{{MAIN_NS}}}c")

    for index, cell in enumerate(existing_cells):
        current_reference = cell.attrib.get("r", "")
        if column_letters_to_index(extract_column_letters(current_reference)) > column_letters_to_index(target_column):
            row.insert(index, new_cell)
            return new_cell

    row.append(new_cell)
    return new_cell


def write_cell_value(cell: ET.Element, value: str) -> None:
    cell_reference = cell.attrib.get("r", "")
    preserved_attributes = {
        key: current_value
        for key, current_value in cell.attrib.items()
        if key != "t"
    }

    cell.attrib.clear()
    cell.attrib.update(preserved_attributes)
    cell.attrib["r"] = cell_reference
    cell.attrib["t"] = "str"

    for child in list(cell):
        cell.remove(child)

    value_node = ET.SubElement(cell, f"{{{MAIN_NS}}}v")
    if should_preserve_whitespace(value):
        value_node.set(f"{{{XML_NS}}}space", "preserve")
    value_node.text = value


def write_archive(workbook_path: str, target_entry: str, updated_bytes: bytes) -> None:
    temp_file = tempfile.NamedTemporaryFile(
        delete=False,
        dir=os.path.dirname(workbook_path) or None,
        suffix=os.path.splitext(workbook_path)[1],
    )
    temp_file.close()

    try:
        with zipfile.ZipFile(workbook_path, "r") as source_zip, zipfile.ZipFile(temp_file.name, "w") as destination_zip:
            for info in source_zip.infolist():
                content = updated_bytes if info.filename == target_entry else source_zip.read(info.filename)
                destination_zip.writestr(info, content)

        os.replace(temp_file.name, workbook_path)
    except Exception:
        if os.path.exists(temp_file.name):
            os.unlink(temp_file.name)
        raise


def extract_column_letters(cell_reference: str) -> str:
    match = re.match(r"^([A-Z]+)\d+$", cell_reference)

    if not match:
        raise ValueError(f"Reference de cellule invalide: {cell_reference}")

    return match.group(1)


def extract_row_number(cell_reference: str) -> int:
    match = re.match(r"^[A-Z]+(\d+)$", cell_reference)

    if not match:
        raise ValueError(f"Reference de cellule invalide: {cell_reference}")

    return int(match.group(1))


def column_letters_to_index(column_letters: str) -> int:
    result = 0

    for character in column_letters:
        result = (result * 26) + (ord(character) - 64)

    return result


def should_preserve_whitespace(value: str) -> bool:
    return value != value.strip() or "\n" in value or "  " in value


if __name__ == "__main__":
    raise SystemExit(main())
