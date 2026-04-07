CREATE TABLE sectors (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(191) NOT NULL,
  UNIQUE KEY uq_sectors_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE zones (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  sector_id BIGINT UNSIGNED NOT NULL,
  code CHAR(3) NOT NULL,
  name VARCHAR(191) NULL,
  x_min INT NOT NULL,
  y_min INT NOT NULL,
  x_max INT NOT NULL,
  y_max INT NOT NULL,
  CONSTRAINT uq_zones_code UNIQUE (code),
  CONSTRAINT chk_zones_code CHECK (code REGEXP '^[0-9]{3}$'),
  CONSTRAINT chk_zones_bounds CHECK (x_min < x_max AND y_min < y_max),
  CONSTRAINT fk_zones_sector
    FOREIGN KEY (sector_id)
    REFERENCES sectors(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE equipment_data (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  equipment_id VARCHAR(191) NOT NULL,
  site VARCHAR(191) NULL,
  contact VARCHAR(191) NULL,
  pin_key VARCHAR(191) NULL,
  sector VARCHAR(191) NULL,
  floor_location VARCHAR(191) NULL,
  zone_code VARCHAR(191) NULL,
  manufacturing_station_names TEXT NULL,
  last_inventory_date VARCHAR(191) NULL,
  asset_type VARCHAR(191) NULL,
  manufacturer VARCHAR(191) NULL,
  model VARCHAR(191) NULL,
  sap VARCHAR(191) NULL,
  hostname VARCHAR(191) NULL,
  operating_system VARCHAR(191) NULL,
  processor VARCHAR(191) NULL,
  memory VARCHAR(191) NULL,
  storage VARCHAR(191) NULL,
  ip_address VARCHAR(191) NULL,
  old_ip_address VARCHAR(191) NULL,
  new_ip_address VARCHAR(191) NULL,
  subnet_mask VARCHAR(191) NULL,
  mac_address VARCHAR(191) NULL,
  vlan VARCHAR(191) NULL,
  vlan_new VARCHAR(191) NULL,
  network_scope VARCHAR(191) NULL,
  gateway VARCHAR(191) NULL,
  id_port VARCHAR(191) NULL,
  switch_port VARCHAR(191) NULL,
  new_port_auto VARCHAR(191) NULL,
  switch_name VARCHAR(191) NULL,
  connected_to_switch_name VARCHAR(191) NULL,
  switch_ip_address VARCHAR(191) NULL,
  connected_to_switch_port VARCHAR(191) NULL,
  connection_type VARCHAR(191) NULL,
  wifi_or_wired_connection VARCHAR(191) NULL,
  ticket_brassage VARCHAR(191) NULL,
  ip_filter VARCHAR(191) NULL,
  directory_account VARCHAR(191) NULL,
  comment_text TEXT NULL,
  secondary_comment TEXT NULL,
  serial_number VARCHAR(191) NULL,
  status VARCHAR(191) NULL,
  security_status VARCHAR(191) NULL,
  UNIQUE KEY uq_equipment_data_equipment_id (equipment_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE equipment (
  id VARCHAR(191) NOT NULL PRIMARY KEY,
  equipment_data_id BIGINT UNSIGNED NOT NULL,
  x INT NOT NULL,
  y INT NOT NULL,
  zone_id BIGINT UNSIGNED NULL,
  CONSTRAINT uq_equipment_equipment_data_id UNIQUE (equipment_data_id),
  CONSTRAINT fk_equipment_equipment_data
    FOREIGN KEY (equipment_data_id)
    REFERENCES equipment_data(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_equipment_zone
    FOREIGN KEY (zone_id)
    REFERENCES zones(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
