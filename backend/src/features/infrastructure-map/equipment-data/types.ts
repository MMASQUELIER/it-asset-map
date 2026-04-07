export interface EquipmentDataDto {
  assetType?: string;
  // Legacy aliases are still exposed for backward compatibility with older CMDB rows.
  comment?: string;
  connectedToSwitchName?: string;
  connectedToSwitchPort?: string;
  connectionType?: string;
  contact?: string;
  directoryAccount?: string;
  equipmentId: string;
  floorLocation?: string;
  gateway?: string;
  hostname?: string;
  id: number;
  idPort?: string;
  ipAddress?: string;
  ipFilter?: string;
  lastInventoryDate?: string;
  macAddress?: string;
  manufacturer?: string;
  manufacturingStationNames?: string;
  memory?: string;
  model?: string;
  networkScope?: string;
  newIpAddress?: string;
  newPortAuto?: string;
  oldIpAddress?: string;
  operatingSystem?: string;
  pinKey?: string;
  processor?: string;
  sap?: string;
  secondaryComment?: string;
  sector?: string;
  securityStatus?: string;
  serialNumber?: string;
  site?: string;
  status?: string;
  storage?: string;
  subnetMask?: string;
  switchIpAddress?: string;
  switchName?: string;
  switchPort?: string;
  ticketBrassage?: string;
  vlan?: string;
  vlanNew?: string;
  wifiOrWiredConnection?: string;
  zoneCode?: string;
}

export const EQUIPMENT_DATA_COLUMN_BY_FIELD = {
  assetType: "asset_type",
  comment: "comment_text",
  connectedToSwitchName: "connected_to_switch_name",
  connectedToSwitchPort: "connected_to_switch_port",
  connectionType: "connection_type",
  contact: "contact",
  directoryAccount: "directory_account",
  equipmentId: "equipment_id",
  floorLocation: "floor_location",
  gateway: "gateway",
  hostname: "hostname",
  idPort: "id_port",
  ipAddress: "ip_address",
  ipFilter: "ip_filter",
  lastInventoryDate: "last_inventory_date",
  macAddress: "mac_address",
  manufacturer: "manufacturer",
  manufacturingStationNames: "manufacturing_station_names",
  memory: "memory",
  model: "model",
  networkScope: "network_scope",
  newIpAddress: "new_ip_address",
  newPortAuto: "new_port_auto",
  oldIpAddress: "old_ip_address",
  operatingSystem: "operating_system",
  pinKey: "pin_key",
  processor: "processor",
  sap: "sap",
  secondaryComment: "secondary_comment",
  sector: "sector",
  securityStatus: "security_status",
  serialNumber: "serial_number",
  site: "site",
  status: "status",
  storage: "storage",
  subnetMask: "subnet_mask",
  switchIpAddress: "switch_ip_address",
  switchName: "switch_name",
  switchPort: "switch_port",
  ticketBrassage: "ticket_brassage",
  vlan: "vlan",
  vlanNew: "vlan_new",
  wifiOrWiredConnection: "wifi_or_wired_connection",
  zoneCode: "zone_code",
} as const;

export type EquipmentDataField = keyof typeof EQUIPMENT_DATA_COLUMN_BY_FIELD;

export const EQUIPMENT_DATA_FIELDS: EquipmentDataField[] = Object.keys(
  EQUIPMENT_DATA_COLUMN_BY_FIELD,
) as EquipmentDataField[];

export type EquipmentDataCreateInput =
  & Pick<EquipmentDataDto, "equipmentId">
  & Partial<Omit<EquipmentDataDto, "id" | "equipmentId">>;

export type EquipmentDataPatch = Partial<
  {
    [Field in EquipmentDataField]: string | null;
  }
>;
