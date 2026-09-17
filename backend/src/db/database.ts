import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

const DB_PATH = path.join(__dirname, "..", "..", "db", "creditos.db");
const SCHEMA_PATH = path.join(__dirname, "..", "..", "db", "schema.sql");

export const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");

export function inicializarBaseDeDatos(): void {
  const schemaSql = fs.readFileSync(SCHEMA_PATH, "utf-8");
  db.exec(schemaSql);
}