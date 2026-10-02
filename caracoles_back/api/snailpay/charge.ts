import { randomUUID } from 'crypto';

export default function handler(req: any, res: any) {
  // Manejo manual de CORS para Vercel
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  // Manejar preflight OPTIONS respondiendo 200 OK
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const {
      numero_tarjeta,
      fecha_vencimiento,
      cvv,
      nombre_completo,
      monto,
      payer_id,
      payer_email
    } = body;

    const montoNum = Number(monto);

    if (montoNum === 999) {
      return res.status(500).json({
        id: randomUUID(),
        status: 'error',
        status_detail: 'internal_system_error',
        transaction_amount: montoNum,
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
      nombre_completo &&
      nombre_completo.trim() !== '' &&
      montoNum > 0;

    if (isSuccess) {
      return res.status(200).json({
        id: randomUUID(),
        status: 'approved',
        status_detail: 'accredited',
        transaction_amount: montoNum,
        date_created: new Date().toISOString(),
        authorization_code: Math.floor(100000 + Math.random() * 900000).toString(),
        reference: `REF-${Date.now()}`,
        payer_id,
        payer_email
      });
    } else {
      return res.status(400).json({
        id: randomUUID(),
        status: 'rejected',
        status_detail: 'cc_rejected_bad_filled_other',
        transaction_amount: montoNum,
        date_created: new Date().toISOString(),
        authorization_code: null,
        reference: `REF-${Date.now()}`,
        payer_id,
        payer_email
      });
    }
  } catch (error: any) {
    return res.status(500).json({
      error: 'Error procesando la solicitud',
      details: error.message
    });
  }
}

// Soporte explícito CommonJS para Vercel Serverless Functions
module.exports = handler;
