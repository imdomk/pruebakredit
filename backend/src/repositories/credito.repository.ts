import {db} from '../db/database';
import type {Credito, CreditoInput} from '../models/credito.model';

export const creditoRepository = {
 crear(input: CreditoInput, cuota: number): Credito {
    const stmt = db.prepare(`
      INSERT INTO creditos (cedula, nombres, apellidos, plazo, tasaInteres, valorCredito, cuota)
      VALUES (@cedula, @nombres, @apellidos, @plazo, @tasaInteres, @valorCredito, @cuota)
    `);
    const result = stmt.run({
      ...input,
      cuota,
    });
    return this.obtenerPorId(Number(result.lastInsertRowid))!;
    },

    listar(): Credito[] {
        return db.prepare('SELECT * FROM creditos ORDER BY id DESC').all() as Credito[];
    },

    obtenerPorId(id: number): Credito | undefined {
        return db.prepare('SELECT * FROM creditos WHERE id = ?').get(id) as Credito | undefined;
    },

    actualizar(id: number, input: CreditoInput, cuota?: number): Credito | undefined {
        const stmt = db.prepare(`
            UPDATE creditos
            SET cedula = @cedula,
                nombres = @nombres,
                apellidos = @apellidos,
                plazo = @plazo,
                tasaInteres = @tasaInteres,
                valorCredito = @valorCredito,
                cuota = @cuota,
                actualizadoEn = datetime('now')
            WHERE id = @id
        `);
        const result = stmt.run({ ...input, cuota, id });
        if (result.changes === 0) {
            return undefined;
        }
        return this.obtenerPorId(id);
    },

    eliminar(id: number): boolean {
        const result = db.prepare('DELETE FROM creditos WHERE id = ?').run(id);
        return result.changes > 0;
    },
};