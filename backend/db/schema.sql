PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS sectors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS zones (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sector_id INTEGER NOT NULL,
  code TEXT NOT NULL UNIQUE,
  name TEXT,
  x_min INTEGER NOT NULL,
  y_min INTEGER NOT NULL,
  x_max INTEGER NOT NULL,
  y_max INTEGER NOT NULL,
  FOREIGN KEY (sector_id) REFERENCES sectors(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CHECK (code GLOB '[0-9][0-9][0-9]'),
  CHECK (x_min < x_max),
  CHECK (y_min < y_max)
);

CREATE INDEX IF NOT EXISTS idx_zones_sector_id ON zones(sector_id);

CREATE TABLE IF NOT EXISTS equipment_data (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  equipment_id TEXT NOT NULL UNIQUE,
  site TEXT,
  contact TEXT,
  pin_key TEXT,
  sector TEXT,
  floor_location TEXT,
  zone_code TEXT,
  manufacturing_station_names TEXT,
  last_inventory_date TEXT,
  asset_type TEXT,
  manufacturer TEXT,
  model TEXT,
  sap TEXT,
  hostname TEXT,
  operating_system TEXT,
  processor TEXT,
  memory TEXT,
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
  security_status TEXT
);

CREATE INDEX IF NOT EXISTS idx_equipment_data_equipment_id
  ON equipment_data(equipment_id);

CREATE TABLE IF NOT EXISTS equipment (
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

CREATE INDEX IF NOT EXISTS idx_equipment_zone_id ON equipment(zone_id);
