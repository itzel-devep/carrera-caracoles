import { Request, Response } from 'express';
import { randomUUID } from 'crypto';

export const chargeBalance = (req: Request, res: Response) => {
  const {
    numero_tarjeta,
    fecha_vencimiento,
    cvv,
    nombre_completo,
    monto,
    payer_id,
    payer_email
  } = req.body;

  // Simulate System Error (e.g., if monto is exactly 999)
  if (monto === 999) {
    return res.status(500).json({
      id: randomUUID(),
      status: 'error',
      status_detail: 'internal_system_error',
      transaction_amount: monto,
      date_created: new Date().toISOString(),
      authorization_code: null,
      reference: `REF-${Date.now()}`,
      payer_id,
      payer_email
    });
  }

  // Validate success criteria
  const isSuccess = 
    numero_tarjeta === '1234123412341234' &&
    fecha_vencimiento === '12/26' &&
    cvv === '543' &&
    nombre_completo && nombre_completo.trim() !== '' &&
    monto > 0;

  if (isSuccess) {
    return res.json({
      id: randomUUID(),
      status: 'approved',
      status_detail: 'accredited',
      transaction_amount: monto,
      date_created: new Date().toISOString(),
      authorization_code: Math.floor(100000 + Math.random() * 900000).toString(), // random 6 digits
      reference: `REF-${Date.now()}`,
      payer_id,
      payer_email
    });
  } else {
    // Transaction Error
    return res.status(400).json({
      id: randomUUID(),
      status: 'rejected',
      status_detail: 'cc_rejected_bad_filled_other',
      transaction_amount: monto,
      date_created: new Date().toISOString(),
      authorization_code: null,
      reference: `REF-${Date.now()}`,
      payer_id,
      payer_email
    });
  }
};
