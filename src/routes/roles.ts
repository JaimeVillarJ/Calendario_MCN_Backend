import { Router, Request, Response } from "express";
import { pool } from '../db';

const router = Router();

// GET /api/roles -> obtener la descripción y tareas de todos los roles
router.get('/', async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM "Roles" ORDER BY rol ASC');
        res.json(result.rows);
    } catch (err) {
        console.log("Error al consultar roles", (err as Error).message);
        res.status(500).send("Error al obtener los roles");
    }
});

// PUT /api/roles/:rol -> actualizar descripción y tareas de un rol específico
router.put('/:rol', async (req: Request, res: Response) => {
    try {
        const { rol } = req.params;
        const { descripcion, tareas } = req.body;

        if (!descripcion || !Array.isArray(tareas)) {
            return res.status(400).json({ error: 'descripcion y tareas (array) son requeridos' });
        }

        const result = await pool.query(
            `UPDATE "Roles"
             SET descripcion = $1, tareas = $2
             WHERE rol = $3
             RETURNING *`,
            [descripcion, JSON.stringify(tareas), rol]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Rol no encontrado' });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.log("Error al actualizar rol", (err as Error).message);
        res.status(500).send("Error al actualizar el rol");
    }
});

export default router;
