import { Router } from 'express';

import {
  listarPedidos,
  crearPedido,
  marcarPedidoEntregado,
  eliminarPedido
} from '../controllers/pedido.controller';

const router = Router();

// GET: listar pedidos
router.get('/', listarPedidos);

// POST: registrar pedido
router.post('/', crearPedido);

// PATCH: marcar pedido como entregado
router.patch('/:id', marcarPedidoEntregado);

// DELETE: eliminar pedido
router.delete('/:id', eliminarPedido);

export default router;