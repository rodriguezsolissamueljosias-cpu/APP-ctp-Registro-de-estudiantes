-- create_db.sql
-- Ejecutar en el cliente de MySQL o con el script PowerShell adjunto

CREATE DATABASE IF NOT EXISTS ctp_platanar_db;
CREATE USER IF NOT EXISTS 'ctp_user'@'localhost' IDENTIFIED BY 'sam2904';
GRANT ALL PRIVILEGES ON ctp_platanar_db.* TO 'ctp_user'@'localhost';
FLUSH PRIVILEGES;

-- Fin
