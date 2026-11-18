import { Router } from 'express';
import {
  listarTickets,
  obtenerTicketPorId,
  crearTicket,
  actualizarTicket,
  parchearTicket,
  eliminarTicket,
} from '../controllers/ticket.controller';

const router = Router();

router.get('/', listarTickets);
router.get('/:id', obtenerTicketPorId);
router.post('/', crearTicket);
router.put('/:id', actualizarTicket);
router.patch('/:id', parchearTicket);
router.delete('/:id', eliminarTicket);

export default router;
