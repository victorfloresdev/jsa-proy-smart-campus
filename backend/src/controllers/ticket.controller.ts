import { Request, Response } from 'express';
import {
  getDb,
  saveDb,
  Ticket,
  PrioridadTicket,
  EstadoTicket,
} from '../models/ticket.model';

const PRIORIDADES_VALIDAS: PrioridadTicket[] = ['Baja', 'Media', 'Alta'];
const ESTADOS_VALIDOS: EstadoTicket[] = ['Pendiente', 'En Revisión', 'Resuelto'];

export function validarTicket(datos: any): { valido: boolean; mensaje?: string } {
  if (!datos.titulo || typeof datos.titulo !== 'string' || datos.titulo.trim().length < 5) {
    return { valido: false, mensaje: 'El título es obligatorio y debe tener al menos 5 caracteres' };
  }
  if (!datos.ambiente || typeof datos.ambiente !== 'string' || datos.ambiente.trim().length === 0) {
    return { valido: false, mensaje: 'El ambiente es obligatorio' };
  }
  if (!datos.pabellon || typeof datos.pabellon !== 'string' || datos.pabellon.trim().length === 0) {
    return { valido: false, mensaje: 'El pabellón es obligatorio' };
  }
  if (!datos.prioridad || !PRIORIDADES_VALIDAS.includes(datos.prioridad)) {
    return { valido: false, mensaje: 'La prioridad debe ser Baja, Media o Alta' };
  }
  if (!datos.descripcion || typeof datos.descripcion !== 'string' || datos.descripcion.trim().length < 10) {
    return { valido: false, mensaje: 'La descripción es obligatoria y debe tener al menos 10 caracteres' };
  }
  if (!datos.autor || typeof datos.autor !== 'string' || datos.autor.trim().length === 0) {
    return { valido: false, mensaje: 'El autor del ticket es obligatorio' };
  }
  if (datos.estado && !ESTADOS_VALIDOS.includes(datos.estado)) {
    return { valido: false, mensaje: 'El estado debe ser Pendiente, En Revisión o Resuelto' };
  }
  return { valido: true };
}

// 1. GET /tickets
export const listarTickets = (req: Request, res: Response): void => {
  const db = getDb();
  let tickets = db.tickets || [];

  const { estado, prioridad, autor, q } = req.query;

  if (typeof estado === 'string' && estado.trim().length > 0) {
    tickets = tickets.filter(
      (t) => t.estado.toLowerCase() === estado.trim().toLowerCase()
    );
  }

  if (typeof prioridad === 'string' && prioridad.trim().length > 0) {
    tickets = tickets.filter(
      (t) => t.prioridad.toLowerCase() === prioridad.trim().toLowerCase()
    );
  }

  if (typeof autor === 'string' && autor.trim().length > 0) {
    tickets = tickets.filter((t) =>
      t.autor.toLowerCase().includes(autor.trim().toLowerCase())
    );
  }

  if (typeof q === 'string' && q.trim().length > 0) {
    const term = q.trim().toLowerCase();
    tickets = tickets.filter(
      (t) =>
        t.titulo.toLowerCase().includes(term) ||
        t.descripcion.toLowerCase().includes(term) ||
        t.ambiente.toLowerCase().includes(term) ||
        t.pabellon.toLowerCase().includes(term)
    );
  }

  res.status(200).json(tickets);
};

// 2. GET /tickets/:id
export const obtenerTicketPorId = (req: Request, res: Response): void => {
  const id = Number(req.params.id);
  const db = getDb();
  const ticket = (db.tickets || []).find((t) => t.id === id);

  if (!ticket) {
    res.status(404).json({ mensaje: 'Ticket no encontrado' });
    return;
  }

  res.status(200).json(ticket);
};

// 3. POST /tickets
export const crearTicket = (req: Request, res: Response): void => {
  const validacion = validarTicket(req.body);
  if (!validacion.valido) {
    res.status(400).json({ mensaje: validacion.mensaje });
    return;
  }

  const db = getDb();
  if (!db.tickets) {
    db.tickets = [];
  }

  const nuevoId =
    db.tickets.length > 0
      ? Math.max(...db.tickets.map((t) => t.id || 0)) + 1
      : 1;

  const fechaActual = new Date().toISOString().split('T')[0];

  const nuevoTicket: Ticket = {
    id: nuevoId,
    titulo: req.body.titulo.trim(),
    ambiente: req.body.ambiente.trim(),
    pabellon: req.body.pabellon.trim(),
    prioridad: req.body.prioridad,
    descripcion: req.body.descripcion.trim(),
    estado: req.body.estado || 'Pendiente',
    fechaReporte: req.body.fechaReporte || fechaActual,
    autor: req.body.autor.trim(),
  };

  db.tickets.push(nuevoTicket);
  saveDb(db);

  res.status(201).json(nuevoTicket);
};

// 4. PUT /tickets/:id
export const actualizarTicket = (req: Request, res: Response): void => {
  const id = Number(req.params.id);
  const validacion = validarTicket(req.body);
  if (!validacion.valido) {
    res.status(400).json({ mensaje: validacion.mensaje });
    return;
  }

  const db = getDb();
  const index = (db.tickets || []).findIndex((t) => t.id === id);

  if (index === -1) {
    res.status(404).json({ mensaje: 'Ticket no encontrado' });
    return;
  }

  const ticketExistente = db.tickets![index];
  const ticketActualizado: Ticket = {
    ...ticketExistente,
    titulo: req.body.titulo.trim(),
    ambiente: req.body.ambiente.trim(),
    pabellon: req.body.pabellon.trim(),
    prioridad: req.body.prioridad,
    descripcion: req.body.descripcion.trim(),
    estado: req.body.estado || ticketExistente.estado,
    fechaReporte: req.body.fechaReporte || ticketExistente.fechaReporte,
    autor: req.body.autor ? req.body.autor.trim() : ticketExistente.autor,
  };

  db.tickets![index] = ticketActualizado;
  saveDb(db);

  res.status(200).json(ticketActualizado);
};

// 5. PATCH /tickets/:id
export const parchearTicket = (req: Request, res: Response): void => {
  const id = Number(req.params.id);
  const db = getDb();
  const index = (db.tickets || []).findIndex((t) => t.id === id);

  if (index === -1) {
    res.status(404).json({ mensaje: 'Ticket no encontrado' });
    return;
  }

  const ticket = db.tickets![index];

  if (req.body.estado !== undefined) {
    if (!ESTADOS_VALIDOS.includes(req.body.estado)) {
      res.status(400).json({ mensaje: 'Estado de ticket no válido' });
      return;
    }
    ticket.estado = req.body.estado;
  }

  if (req.body.prioridad !== undefined) {
    if (!PRIORIDADES_VALIDAS.includes(req.body.prioridad)) {
      res.status(400).json({ mensaje: 'Prioridad de ticket no válida' });
      return;
    }
    ticket.prioridad = req.body.prioridad;
  }

  if (typeof req.body.titulo === 'string' && req.body.titulo.trim().length >= 5) {
    ticket.titulo = req.body.titulo.trim();
  }

  if (typeof req.body.descripcion === 'string' && req.body.descripcion.trim().length >= 10) {
    ticket.descripcion = req.body.descripcion.trim();
  }

  if (typeof req.body.ambiente === 'string' && req.body.ambiente.trim().length > 0) {
    ticket.ambiente = req.body.ambiente.trim();
  }

  if (typeof req.body.pabellon === 'string' && req.body.pabellon.trim().length > 0) {
    ticket.pabellon = req.body.pabellon.trim();
  }

  db.tickets![index] = ticket;
  saveDb(db);

  res.status(200).json(ticket);
};

// 6. DELETE /tickets/:id
export const eliminarTicket = (req: Request, res: Response): void => {
  const id = Number(req.params.id);
  const db = getDb();
  const index = (db.tickets || []).findIndex((t) => t.id === id);

  if (index === -1) {
    res.status(404).json({ mensaje: 'Ticket no encontrado' });
    return;
  }

  const [eliminado] = db.tickets!.splice(index, 1);
  saveDb(db);

  res.status(200).json(eliminado);
};
