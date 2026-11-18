import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { Pedido, NuevoPedido } from '../models/pedido.model';

const dbPath = path.join(__dirname, '../data/db.json');

// Obtener todos los pedidos
export const listarPedidos = (req: Request, res: Response): void => {
  try {
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    res.json(db.pedidos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener los pedidos' });
  }
};

// Registrar un pedido nuevo
export const crearPedido = (req: Request, res: Response): void => {
  try {
    const nuevoPedido: NuevoPedido = req.body;

    if (
      !nuevoPedido.plato ||
      !nuevoPedido.categoria ||
      !nuevoPedido.precio ||
      !nuevoPedido.cantidad ||
      !nuevoPedido.autor
    ) {
      res.status(400).json({ mensaje: 'Faltan datos del pedido' });
      return;
    }

    const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

    const nuevoId = db.pedidos.length > 0
      ? Math.max(...db.pedidos.map((p: Pedido) => p.id)) + 1
      : 1;

    const pedido: Pedido = {
      id: nuevoId,
      ...nuevoPedido,
      total: nuevoPedido.precio * nuevoPedido.cantidad,
      fecha: new Date().toISOString(),
      estado: 'En preparación'
    };

    db.pedidos.push(pedido);

    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

    res.status(201).json(pedido);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al registrar el pedido' });
  }
};

// Marcar un pedido como entregado
export const marcarPedidoEntregado = (req: Request, res: Response): void => {
  try {
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    const id = Number(req.params.id);

    const pedido = db.pedidos.find((p: Pedido) => p.id === id);

    if (!pedido) {
      res.status(404).json({ mensaje: 'Pedido no encontrado' });
      return;
    }

    pedido.estado = 'Entregado';

    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

    res.json(pedido);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar el pedido' });
  }
};

// Eliminar un pedido
export const eliminarPedido = (req: Request, res: Response): void => {
  try {
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    const id = Number(req.params.id);

    const indice = db.pedidos.findIndex((p: Pedido) => p.id === id);

    if (indice === -1) {
      res.status(404).json({ mensaje: 'Pedido no encontrado' });
      return;
    }

    db.pedidos.splice(indice, 1);

    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

    res.json({ mensaje: 'Pedido eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar el pedido' });
  }
};