import express from 'express'
import userRoutes from './routes/users.js';
import eventRoutes from './routes/events.js';
import cors from 'cors'

const app = express()
const port = 3001
app.use(cors());

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Terjadi kesalahan server' });
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})

export default app