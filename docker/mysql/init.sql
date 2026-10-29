SET NAMES utf8mb4;

CREATE TABLE productos (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    precio DECIMAL(10, 2) UNSIGNED NOT NULL,
    stock INT UNSIGNED NOT NULL DEFAULT 0
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO productos (nombre, descripcion, precio, stock) VALUES
    ('Teclado mecánico', 'Teclado compacto con conexión USB.', 59.90, 12),
    ('Ratón inalámbrico', 'Ratón ergonómico con receptor USB.', 24.50, 30),
    ('Monitor de 27 pulgadas', 'Monitor IPS con resolución QHD.', 219.00, 8),
    ('Soporte para portátil', 'Soporte de aluminio regulable en altura.', 34.95, 0);
