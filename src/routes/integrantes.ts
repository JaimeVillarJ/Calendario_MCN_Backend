import { Router, Request, Response } from "express";
import { pool } from '../db';

const router = Router();

// GET /api/integrantes -> obtener todos los integrantes
// GET /api/integrantes?grupo_id=xxx -> obtener solo los de un grupo
router.get('/', async (req: Request, res: Response) => {
    try {
        const { grupo_id } = req.query;

        if (grupo_id) {
            const result = await pool.query(
                'SELECT * FROM "Integrantes" WHERE grupo_id = $1',
                [grupo_id]
            );
            return res.json(result.rows);
        }

        const result = await pool.query('SELECT * FROM "Integrantes"');
        res.json(result.rows);
    } catch (err) {
        console.log("Error al consultar integrantes", (err as Error).message);
        res.status(500).send("Error al obtener los integrantes");
    }
});

// POST /api/integrantes -> crear un nuevo integrante dentro de un grupo
router.post('/', async (req: Request, res: Response) => {
    try {
        const { nombre, rol, grupo_id } = req.body;

        if (!nombre || !nombre.trim() || !rol || !grupo_id) {
            return res.status(400).json({ error: 'nombre, rol y grupo_id son requeridos' });
        }

        const result = await pool.query(
            `INSERT INTO "Integrantes" (nombre, rol, grupo_id)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [nombre.trim(), rol, grupo_id]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.log("Error al insertar integrante", (err as Error).message);
        res.status(500).send("Error al crear el integrante");
    }
});

// PUT /api/integrantes/:id -> editar nombre y/o rol de un integrante
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { nombre, rol } = req.body;

        if (!nombre || !nombre.trim() || !rol) {
            return res.status(400).json({ error: 'nombre y rol son requeridos' });
        }

        const result = await pool.query(
            `UPDATE "Integrantes"
             SET nombre = $1, rol = $2
             WHERE id = $3
             RETURNING *`,
            [nombre.trim(), rol, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Integrante no encontrado' });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.log("Error al actualizar integrante", (err as Error).message);
        res.status(500).send("Error al actualizar el integrante");
    }
});

// DELETE /api/integrantes/:id -> eliminar un integrante
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `DELETE FROM "Integrantes" WHERE id = $1 RETURNING *`,
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Integrante no encontrado' });
        }

        res.status(200).json({ message: 'Integrante eliminado', integrante: result.rows[0] });
    } catch (err) {
        console.log("Error al eliminar integrante", (err as Error).message);
        res.status(500).send("Error al eliminar el integrante");
    }
});

export default router;
