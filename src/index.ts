import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

import calendarioRoutes from './routes/calendario';
import gruposRoutes from './routes/grupos';
import integrantesRoutes from './routes/integrantes';
import rolesRoutes from './routes/roles';

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend funcionando 🚀');
});

app.use('/api/calendario', calendarioRoutes);
app.use('/api/grupos', gruposRoutes);
app.use('/api/integrantes', integrantesRoutes);
app.use('/api/roles', rolesRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});