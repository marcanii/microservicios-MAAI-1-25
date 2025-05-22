-- Crear las bases de datos si no existen
CREATE DATABASE IF NOT EXISTS auth_db;
CREATE DATABASE IF NOT EXISTS eventos_db;
CREATE DATABASE IF NOT EXISTS pagos_db;
CREATE DATABASE IF NOT EXISTS notificaciones_db;

-- ========================================
-- auth_db
-- ========================================
USE auth_db;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE IF NOT EXISTS usuarios (
  id INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  contrasena VARCHAR(255) NOT NULL,
  rol VARCHAR(50) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO usuarios (id, nombre, email, contrasena, rol) VALUES
(1, 'Marcani', 'marcani@gmail.com', '$2b$12$LSDwtXcy5zOFCq/4C1jo.eHqIoi5KoMfVDUjs/fRvUjZC6ZGyAJgm', 'admin'),
(2, 'Juan Perez', 'juan@gmail.com', '$2b$12$w2FPkdRj8CeYlQw9b5fPaO6T07bFkEqaHSoDmMLoybo6CbTmCKTzG', 'user');

COMMIT;

-- ========================================
-- eventos_db
-- ========================================
USE eventos_db;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE IF NOT EXISTS eventos (
  id INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(200) COLLATE utf8mb4_general_ci NOT NULL,
  fecha DATETIME NOT NULL,
  lugar VARCHAR(150) COLLATE utf8mb4_general_ci NOT NULL,
  capacidad INT NOT NULL,
  precio INT NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO eventos (id, nombre, fecha, lugar, capacidad, precio) VALUES
(1, 'CCBOL', '2025-05-31 22:00:00', 'Sucre', 98, 300),
(2, 'Programacion Competitiva', '2025-05-31 22:00:00', 'Sucre', 21, 10);

COMMIT;

-- ========================================
-- notificaciones_db
-- ========================================
USE notificaciones_db;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE IF NOT EXISTS mensajes (
  id INT NOT NULL AUTO_INCREMENT,
  id_evento INT NOT NULL,
  nombre_evento VARCHAR(255) NOT NULL,
  id_usuario INT NOT NULL,
  nombre_usuario VARCHAR(255) NOT NULL,
  pagado TINYINT(1) NOT NULL,
  created_at DATETIME DEFAULT NULL,
  total FLOAT NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO mensajes (id, id_evento, nombre_evento, id_usuario, nombre_usuario, pagado, created_at, total) VALUES
(1, 1, 'CCBOL', 2, 'Juan Pérez', 1, '2025-05-22 14:27:36', 450),
(2, 2, 'Programacion Competitiva', 2, 'juan@gmail.com', 1, '2025-05-22 16:21:01', 10);

COMMIT;

-- ========================================
-- pagos_db
-- ========================================
USE pagos_db;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE IF NOT EXISTS compras (
  id INT NOT NULL AUTO_INCREMENT,
  id_evento INT NOT NULL,
  nombre_evento VARCHAR(255) NOT NULL,
  precio_evento FLOAT NOT NULL,
  cantidad INT NOT NULL,
  id_usuario INT NOT NULL,
  nombre_usuario VARCHAR(255) NOT NULL,
  num_tarjeta VARCHAR(255) NOT NULL,
  expiracion VARCHAR(10) NOT NULL,
  cvv INT NOT NULL,
  pagado TINYINT(1) NOT NULL,
  total FLOAT NOT NULL,
  created_at DATETIME NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO compras (id, id_evento, nombre_evento, precio_evento, cantidad, id_usuario, nombre_usuario, num_tarjeta, expiracion, cvv, pagado, total, created_at) VALUES
(1, 1, 'CCBOL', 300, 2, 2, 'Juan Pérez', '4111111111111111', '12/25', 123, 0, 600, '2025-05-22 14:27:36'),
(2, 2, 'Programacion Competitiva', 10, 4, 2, 'juan@gmail.com', '1234 1234 1234 1234', '25/05', 321, 0, 40, '2025-05-22 14:42:05'),
(3, 2, 'Programacion Competitiva', 10, 1, 1, 'marcani@gmail.com', '1234 1234 1234 1234', '02/08', 521, 0, 10, '2025-05-22 15:00:00');

COMMIT;
