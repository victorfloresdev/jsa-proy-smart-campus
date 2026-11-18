import { Request, Response } from 'express';
import { getDb, saveDb, Reserva } from '../models/reserva.model';

export function validarReserva(datos: any): { valido: boolean; mensaje?: string } {
  if (!datos.espacio || typeof datos.espacio !== 'string' || datos.espacio.trim().length < 3) {
    return { valido: false, mensaje: 'El espacio es obligatorio (mínimo 3 caracteres)' };
  }
  if (!datos.tipoEspacio || typeof datos.tipoEspacio !== 'string') {
    return { valido: false, mensaje: 'El tipo de espacio es obligatorio' };
  }
  if (!datos.fecha) {
    return { valido: false, mensaje: 'La fecha es obligatoria' };
  }
  if (!datos.bloqueHorario || typeof datos.bloqueHorario !== 'string') {
    return { valido: false, mensaje: 'El bloque horario es obligatorio' };
  }
  if (!datos.motivo || typeof datos.motivo !== 'string' || datos.motivo.trim().length < 5) {
    return { valido: false, mensaje: 'El motivo es obligatorio (mínimo 5 caracteres)' };
  }
  const cantidadPersonas = Number(datos.cantidadPersonas);
  if (isNaN(cantidadPersonas) || cantidadPersonas < 2 || cantidadPersonas > 10) {
    return { valido: false, mensaje: 'La cantidad de personas debe ser un número entre 2 y 10' };
  }
  if (!datos.autor || typeof datos.autor !== 'string') {
    return { valido: false, mensaje: 'El autor es obligatorio' };
  }
  return { valido: true };
}

// 1. GET /reservas
export const listarReservas = (req: Request, res: Response) => {
  const reservas = getDb().reservas || [];
  res.status(200).json(reservas);
};

// 2. GET /reservas/:id
export const obtenerReservaPorId = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const reservas = getDb().reservas || [];
  const reserva = reservas.find((r: Reserva) => r.id === id);

  if (!reserva) {
    return res.status(404).json({ mensaje: 'Reserva no encontrada' });
  }

  res.status(200).json(reserva);
};

// 3. POST /reservas
export const crearReserva = (req: Request, res: Response) => {
  const validacion = validarReserva(req.body);
  if (!validacion.valido) {
    return res.status(400).json({ mensaje: validacion.mensaje });
  }

  const db = getDb();
  if (!db.reservas) db.reservas = [];

  const nuevoId = db.reservas.length > 0 ? Math.max(...db.reservas.map((r: Reserva) => r.id || 0)) + 1 : 1;

  const nuevaReserva: Reserva = {
    id: nuevoId,
    espacio: req.body.espacio.trim(),
    tipoEspacio: req.body.tipoEspacio.trim(),
    fecha: req.body.fecha,
    bloqueHorario: req.body.bloqueHorario.trim(),
    motivo: req.body.motivo.trim(),
    cantidadPersonas: Number(req.body.cantidadPersonas),
    estado: req.body.estado || 'Confirmada',
    autor: req.body.autor.trim()
  };

  db.reservas.push(nuevaReserva);
  saveDb(db);

  res.status(201).json(nuevaReserva);
};

// 4. PUT /reservas/:id
export const actualizarReserva = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const validacion = validarReserva(req.body);
  if (!validacion.valido) {
    return res.status(400).json({ mensaje: validacion.mensaje });
  }

  const db = getDb();
  const index = (db.reservas || []).findIndex((r: Reserva) => r.id === id);

  if (index === -1) {
    return res.status(404).json({ mensaje: 'Reserva no encontrada' });
  }

  const reservaActualizada: Reserva = {
    id,
    espacio: req.body.espacio.trim(),
    tipoEspacio: req.body.tipoEspacio.trim(),
    fecha: req.body.fecha,
    bloqueHorario: req.body.bloqueHorario.trim(),
    motivo: req.body.motivo.trim(),
    cantidadPersonas: Number(req.body.cantidadPersonas),
    estado: req.body.estado || 'Confirmada',
    autor: req.body.autor.trim()
  };

  db.reservas[index] = reservaActualizada;
  saveDb(db);

  res.status(200).json(reservaActualizada);
};

// 5. PATCH /reservas/:id
export const parchearReserva = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const db = getDb();
  const index = (db.reservas || []).findIndex((r: Reserva) => r.id === id);

  if (index === -1) {
    return res.status(404).json({ mensaje: 'Reserva no encontrada' });
  }

  const reserva = db.reservas[index];

  if (req.body.estado !== undefined) {
    reserva.estado = req.body.estado;
  }
  if (req.body.motivo !== undefined) {
    reserva.motivo = req.body.motivo.trim();
  }

  db.reservas[index] = reserva;
  saveDb(db);

  res.status(200).json(reserva);
};

// 6. DELETE /reservas/:id
export const eliminarReserva = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const db = getDb();
  const index = (db.reservas || []).findIndex((r: Reserva) => r.id === id);

  if (index === -1) {
    return res.status(404).json({ mensaje: 'Reserva no encontrada' });
  }

  const [eliminada] = db.reservas.splice(index, 1);
  saveDb(db);

  res.status(200).json(eliminada);
};