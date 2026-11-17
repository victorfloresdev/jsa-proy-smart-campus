import { Router } from 'express';
import {
  listarReservas,
  obtenerReservaPorId,
  crearReserva,
  actualizarReserva,
  parchearReserva,
  eliminarReserva
} from '../controllers/reserva.controller';

const router = Router();

router.get('/', listarReservas);
router.get('/:id', obtenerReservaPorId);
router.post('/', crearReserva);
router.put('/:id', actualizarReserva);
router.patch('/:id', parchearReserva);
router.delete('/:id', eliminarReserva);

export default router;