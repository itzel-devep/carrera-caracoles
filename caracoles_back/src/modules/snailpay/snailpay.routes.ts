import { Router } from 'express';
import { chargeBalance } from './snailpay.controller';

const router = Router();

router.post('/charge', chargeBalance);

export default router;
