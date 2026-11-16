import { Router } from 'express';
import {
  listarRutas,
  obtenerRutaPorId,
  crearRuta,
  actualizarRuta,
  parchearRuta,
  eliminarRuta
} from '../controllers/carpooling.controller';

const router = Router();

router.get('/', listarRutas);
router.get('/:id', obtenerRutaPorId);
router.post('/', crearRuta);
router.put('/:id', actualizarRuta);
router.patch('/:id', parchearRuta);
router.delete('/:id', eliminarRuta);

export default router;
