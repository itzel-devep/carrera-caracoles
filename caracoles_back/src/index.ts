import express from 'express';
import cors from 'cors';
import snailpayRoutes from './modules/snailpay/snailpay.routes';

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.use(['/api/snailpay', '/snailpay'], snailpayRoutes);

app.get(['/api/health', '/health'], (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Backend is running on Vercel!' });
});

// Fallback para depurar qué URL está recibiendo Express realmente en Vercel
app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada por Express',
    method: req.method,
    url: req.url,
    originalUrl: req.originalUrl
  });
});

const PORT = process.env.PORT || 3001;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
  });
}

export default app;
module.exports = app;
