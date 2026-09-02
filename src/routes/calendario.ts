import { Router, Request, Response } from "express";
import { pool } from '../db';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM "Calendario"');
        res.json(result.rows);
    } catch (err) {
        console.log("Error al consultar", (err as Error).message);
        res.status(500).send("Error al obtener el calendario");
    }
});

router.post('/', async (req: Request, res: Response) => {
    try {
        const { date, assigneeName, type, taskText } = req.body;

        // Validación básica
        if (!date || !assigneeName || !type || !taskText) {
            return res.status(400).json({ error: 'Faltan campos requeridos' });
        }

        // Mapeo del tipo según lo que espera el frontend ("person" -> "Persona", "team" -> "Equipo")
        const tipoMapped = type === 'person' ? 'Persona' : (type === 'team' ? 'Equipo' : type);

        const result = await pool.query(
            `INSERT INTO "Calendario" ("Fecha", "Nombre", "Tipo", "Descripcion")
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [date, assigneeName, tipoMapped, taskText]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.log("Error al insertar", (err as Error).message);
        res.status(500).send("Error al guardar la asignación");
    }
});

export default router;