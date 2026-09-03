import { Router, Request, Response } from "express";
import { pool } from '../db';

const router = Router();

// GET /api/grupos -> obtener todos los grupos
router.get('/', async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM "Grupos" ORDER BY "Nombre" ASC');
        res.json(result.rows);
    } catch (err) {
        console.log("Error al consultar grupos", (err as Error).message);
        res.status(500).send("Error al obtener los grupos");
    }
});

// POST /api/grupos -> crear un nuevo grupo
router.post('/', async (req: Request, res: Response) => {
    try {
        const { Nombre } = req.body;

        if (!Nombre || !Nombre.trim()) {
            return res.status(400).json({ error: 'El Nombre del grupo es requerido' });
        }

        const result = await pool.query(
            `INSERT INTO "Grupos" ("Nombre")
             VALUES ($1)
             RETURNING *`,
            [Nombre.trim()]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.log("Error al insertar grupo", (err as Error).message);
        res.status(500).send("Error al crear el grupo");
    }
});

// DELETE /api/grupos/:id -> eliminar un grupo
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `DELETE FROM "Grupos" WHERE id = $1 RETURNING *`,
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Grupo no encontrado' });
        }

        res.status(200).json({ message: 'Grupo eliminado', grupo: result.rows[0] });
    } catch (err) {
        console.log("Error al eliminar grupo", (err as Error).message);
        res.status(500).send("Error al eliminar el grupo");
    }
});

export default router;
