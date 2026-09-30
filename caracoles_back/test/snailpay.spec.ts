import request from 'supertest';
import app from '../src/index';

describe('SnailPay Mock API', () => {
  it('should return approved for valid data', async () => {
    const res = await request(app)
      .post('/api/snailpay/charge')
      .send({
        numero_tarjeta: '1234123412341234',
        fecha_vencimiento: '12/26',
        cvv: '543',
        nombre_completo: 'John Doe',
        monto: 100,
        payer_id: 'user_123',
        payer_email: 'john@example.com'
      });
    
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('approved');
    expect(res.body.status_detail).toBe('accredited');
    expect(res.body.transaction_amount).toBe(100);
  });

  it('should return rejected for invalid data', async () => {
    const res = await request(app)
      .post('/api/snailpay/charge')
      .send({
        numero_tarjeta: '1111222233334444', // invalid card
        fecha_vencimiento: '12/26',
        cvv: '543',
        nombre_completo: 'John Doe',
        monto: 100,
        payer_id: 'user_123',
        payer_email: 'john@example.com'
      });
    
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('rejected');
  });

  it('should return error for system failure simulation', async () => {
    const res = await request(app)
      .post('/api/snailpay/charge')
      .send({
        numero_tarjeta: '1234123412341234',
        fecha_vencimiento: '12/26',
        cvv: '543',
        nombre_completo: 'John Doe',
        monto: 999, // trigger system error
        payer_id: 'user_123',
        payer_email: 'john@example.com'
      });
    
    expect(res.status).toBe(500);
    expect(res.body.status).toBe('error');
    expect(res.body.status_detail).toBe('internal_system_error');
  });
});
