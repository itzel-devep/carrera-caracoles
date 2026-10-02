import { v4 as uuidv4 } from 'uuid';

export default function handler(req: any, res: any) {
  // Manejo manual de CORS para Vercel
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const {
    numero_tarjeta,
    fecha_vencimiento,
    cvv,
    nombre_completo,
    monto,
    payer_id,
    payer_email
  } = req.body;

  if (monto === 999) {
    return res.status(500).json({
      id: uuidv4(),
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

  const isSuccess = 
    numero_tarjeta === '1234123412341234' &&
    fecha_vencimiento === '12/26' &&
    cvv === '543' &&
    nombre_completo && nombre_completo.trim() !== '' &&
    monto > 0;

  if (isSuccess) {
    return res.json({
      id: uuidv4(),
      status: 'approved',
      status_detail: 'accredited',
      transaction_amount: monto,
      date_created: new Date().toISOString(),
      authorization_code: Math.floor(100000 + Math.random() * 900000).toString(),
      reference: `REF-${Date.now()}`,
      payer_id,
      payer_email
    });
  } else {
    return res.status(400).json({
      id: uuidv4(),
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
}
