import { Router } from 'express';
import {
  listarObjetos,
  crearObjeto,
  marcarRecuperado,
  eliminarObjeto,
} from '../controllers/objeto.controller';

const router = Router();

router.get('/', listarObjetos);
router.post('/', crearObjeto);
router.patch('/:id', marcarRecuperado);
router.delete('/:id', eliminarObjeto);

export default router;