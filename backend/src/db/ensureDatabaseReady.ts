import {
  getSqliteDatabase,
  hasSqliteTable,
  readSqliteRows,
} from "@/db/sqlite.ts";
import {
  buildAvailableSectorColor,
  isLegacySectorColor,
} from "@/features/infrastructure-map/sectors/colors.ts";

export async function ensureDatabaseReady(): Promise<void> {
  const database = getSqliteDatabase();

  if (!hasRequiredTables()) {
    const schemaSql = await Deno.readTextFile(
      new URL("../../db/schema.sql", import.meta.url),
    );

    database.exec(schemaSql);
    console.log("SQLite schema initialized.");
  }

  migrateSectorSchema();
  migrateDatabaseSchema();
  console.log("SQLite schema is ready.");
}

function hasRequiredTables(): boolean {
  return ["sectors", "zones", "equipment_data", "equipment"].every(
    hasSqliteTable,
  );
}

function migrateDatabaseSchema(): void {
  if (!hasLegacyEquipmentDataColumns()) {
    return;
  }

  const database = getSqliteDatabase();

  database.exec("PRAGMA foreign_keys = OFF");

  try {
    database.exec("BEGIN IMMEDIATE");
    database.exec(`
      ALTER TABLE equipment RENAME TO equipment_old;

      ALTER TABLE equipment_data RENAME TO equipment_data_old;

      CREATE TABLE equipment_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        site TEXT,
        contact TEXT,
        pin_key TEXT,
        sector TEXT,
        floor_location TEXT,
        prodsheet TEXT,
        manufacturing_station_names TEXT,
        last_inventory_date TEXT,
        asset_type TEXT,
        manufacturer TEXT,
        model TEXT,
        sap TEXT,
        hostname TEXT,
        operating_system TEXT,
        storage TEXT,
        ip_address TEXT,
        old_ip_address TEXT,
        new_ip_address TEXT,
        subnet_mask TEXT,
        mac_address TEXT,
        vlan TEXT,
        vlan_new TEXT,
        network_scope TEXT,
        gateway TEXT,
        id_port TEXT,
        switch_port TEXT,
        new_port_auto TEXT,
        switch_name TEXT,
        connected_to_switch_name TEXT,
        switch_ip_address TEXT,
        connected_to_switch_port TEXT,
        connection_type TEXT,
        wifi_or_wired_connection TEXT,
        ticket_brassage TEXT,
        ip_filter TEXT,
        directory_account TEXT,
        comment_text TEXT,
        secondary_comment TEXT,
        serial_number TEXT,
        status TEXT,
        security_status TEXT,
        source_sheet TEXT
      );

      INSERT INTO equipment_data (
        id,
        site,
        contact,
        pin_key,
        sector,
        floor_location,
        prodsheet,
        manufacturing_station_names,
        last_inventory_date,
        asset_type,
        manufacturer,
        model,
        sap,
        hostname,
        operating_system,
        storage,
        ip_address,
        old_ip_address,
        new_ip_address,
        subnet_mask,
        mac_address,
        vlan,
        vlan_new,
        network_scope,
        gateway,
        id_port,
        switch_port,
        new_port_auto,
        switch_name,
        connected_to_switch_name,
        switch_ip_address,
        connected_to_switch_port,
        connection_type,
        wifi_or_wired_connection,
        ticket_brassage,
        ip_filter,
        directory_account,
        comment_text,
        secondary_comment,
        serial_number,
        status,
        security_status,
        source_sheet
      )
      SELECT
        id,
        site,
        contact,
        pin_key,
        sector,
        floor_location,
        zone_code,
        manufacturing_station_names,
        last_inventory_date,
        asset_type,
        manufacturer,
        model,
        sap,
        hostname,
        operating_system,
        storage,
        ip_address,
        old_ip_address,
        new_ip_address,
        subnet_mask,
        mac_address,
        vlan,
        vlan_new,
        network_scope,
        gateway,
        id_port,
        switch_port,
        new_port_auto,
        switch_name,
        connected_to_switch_name,
        switch_ip_address,
        connected_to_switch_port,
        connection_type,
        wifi_or_wired_connection,
        ticket_brassage,
        ip_filter,
        directory_account,
        comment_text,
        secondary_comment,
        serial_number,
        status,
        security_status,
        source_sheet
      FROM equipment_data_old;

      CREATE TABLE equipment (
        id TEXT PRIMARY KEY,
        equipment_data_id INTEGER NOT NULL UNIQUE,
        x INTEGER NOT NULL,
        y INTEGER NOT NULL,
        zone_id INTEGER,
        FOREIGN KEY (equipment_data_id)
          REFERENCES equipment_data(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (zone_id)
          REFERENCES zones(id) ON DELETE SET NULL ON UPDATE CASCADE
      );

      INSERT INTO equipment (id, equipment_data_id, x, y, zone_id)
      SELECT
        CAST(equipment_data_id AS TEXT),
        equipment_data_id,
        x,
        y,
        zone_id
      FROM equipment_old;

      DROP TABLE equipment_old;
      DROP TABLE equipment_data_old;

      CREATE INDEX idx_equipment_zone_id ON equipment(zone_id);
    `);
    database.exec("COMMIT");
    console.log(
      "SQLite schema migrated: removed deprecated equipment_data columns.",
    );
  } catch (error) {
    try {
      database.exec("ROLLBACK");
    } catch {
      // Ignore rollback failures so the original error is preserved.
    }

    throw error;
  } finally {
    database.exec("PRAGMA foreign_keys = ON");
  }
}

function migrateSectorSchema(): void {
  const database = getSqliteDatabase();

  if (!hasSectorColorColumn()) {
    database.exec("ALTER TABLE sectors ADD COLUMN color TEXT");
    console.log("SQLite schema migrated: added sectors.color column.");
  }

  const sectors = readSqliteRows<{ color?: string | null; id: number; name: string }>(
    "SELECT id, name, color FROM sectors ORDER BY id ASC",
  );
  const updateSectorColor = database.prepare(
    "UPDATE sectors SET color = ? WHERE id = ?",
  );

  if (!shouldRebalanceSectorColors(sectors)) {
    return;
  }

  const assignedColors: string[] = [];

  for (const sector of sectors) {
    const nextColor = buildAvailableSectorColor(sector.name, assignedColors);
    assignedColors.push(nextColor);

    if ((sector.color?.trim() ?? "") === nextColor) {
      continue;
    }

    updateSectorColor.run(nextColor, sector.id);
  }

  console.log("SQLite schema migrated: refreshed sector colors.");
}

function hasLegacyEquipmentDataColumns(): boolean {
  const columns = readSqliteRows<{ name: string }>(
    "PRAGMA table_info(equipment_data)",
  );

  return columns.some((column) =>
    column.name === "equipment_id" ||
    column.name === "zone_code" ||
    column.name === "processor" ||
    column.name === "memory" ||
    column.name === "source_row_number" ||
    column.name === "raw_asset_json"
  );
}

function hasSectorColorColumn(): boolean {
  const columns = readSqliteRows<{ name: string }>(
    "PRAGMA table_info(sectors)",
  );

  return columns.some((column) => column.name === "color");
}

function shouldRebalanceSectorColors(
  sectors: { color?: string | null; id: number; name: string }[],
): boolean {
  const usedColors = new Set<string>();

  for (const sector of sectors) {
    const currentColor = sector.color?.trim() ?? "";

    if (currentColor.length === 0 || isLegacySectorColor(currentColor)) {
      return true;
    }

    const normalizedColor = currentColor.toLowerCase();

    if (usedColors.has(normalizedColor)) {
      return true;
    }

    usedColors.add(normalizedColor);
  }

  return false;
}
