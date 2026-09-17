CREATE TABLE IF NOT EXISTS creditos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cedula TEXT NOT NULL,
    nombres TEXT NOT NULL,
    apellidos TEXT NOT NULL,
    plazo INTEGER NOT NULL CHECK (plazo > 0),
    tasaInteres REAL NOT NULL CHECK (tasaInteres >= 0),
    valorCredito REAL NOT NULL CHECK (valorCredito >= 0),
    cuota REAL NOT NULL,
    creadoEn TEXT NOT NULL DEFAULT (datetime('now')),
    actualizadoEn TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_creditos_cedula ON creditos (cedula);

INSERT INTO creditos (cedula, nombres, apellidos, plazo, tasaInteres, valorCredito, cuota)
SELECT '123456789', 'Juan', 'Perez', 12, 1.5, 5000000, ROUND((5000000 + (5000000 * 1.5 / 100) * 12) / 12, 2)
WHERE NOT EXISTS (SELECT 1 FROM creditos WHERE cedula = '123456789');