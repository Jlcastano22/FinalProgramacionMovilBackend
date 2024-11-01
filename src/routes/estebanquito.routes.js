import cors from 'cors';
import { Router } from 'express';
import { metodosBanco } from '../controllers/estebanquito.controller.js';

// instanciar
const router = Router();

const corsOptions = { origin: 'http://localhost:8081', optionsSuccessStatus: 200 };

router.use(cors(corsOptions));

router.get('/Usuario', metodosBanco.getUsuario);
router.get('/Transaccion', metodosBanco.getTransaccion);
router.get('/Prestamo', metodosBanco.getPrestamo);
router.get('/Reporte', metodosBanco.getReporte);

router.get('/Usuario/:id', metodosBanco.getUsuarioById);
router.get('/Transaccion/:id', metodosBanco.getTransaccionById);
router.get('/Prestamo/:id', metodosBanco.getPrestamoById);
router.get('/Reporte/:id', metodosBanco.getReporteById);

router.post('/Usuario', metodosBanco.postUsuario);
router.post('/postTransaccion', metodosBanco.postTransaccion);
router.post('/postTransaccionTransferencia', metodosBanco.postTransaccionTransferencia);
router.post('/postPrestamo', metodosBanco.postPrestamo);
router.post('/postReporte', metodosBanco.postReporte);

router.put('/putUsuario/:id/saldo', metodosBanco.updateSaldoUsuario);
router.put('/putUsuario/:cuenta/saldobycuenta', metodosBanco.updateSaldoUsuarioByCuenta);
router.put('/putReporte/:id/ingreso', metodosBanco.updateHistoricoIngreso);
router.put('/putReporte/:id/egreso', metodosBanco.updateHistoricoEgreso);
router.put('/putReporte/:cuenta/ingresobycuenta', metodosBanco.updateHistoricoIngresoByCuenta);

export default router;
