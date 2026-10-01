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

app.use('/api/snailpay', snailpayRoutes);

const PORT = process.env.PORT || 3001;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
  });
}

export default app;
