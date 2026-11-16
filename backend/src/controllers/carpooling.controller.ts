import { Request, Response } from 'express';
import { getDb, saveDb, RutaCarpooling } from '../models/carpooling.model';

export function validarRuta(datos: any): { valido: boolean; mensaje?: string } {
  if (!datos.origen || typeof datos.origen !== 'string' || datos.origen.trim().length < 3) {
    return { valido: false, mensaje: 'El origen es obligatorio y debe tener al menos 3 caracteres' };
  }
  if (!datos.destino || typeof datos.destino !== 'string' || datos.destino.trim().length < 3) {
    return { valido: false, mensaje: 'El destino es obligatorio y debe tener al menos 3 caracteres' };
  }
  if (!datos.puntosIntermedios || typeof datos.puntosIntermedios !== 'string' || datos.puntosIntermedios.trim().length < 5) {
    return { valido: false, mensaje: 'Los puntos intermedios son obligatorios (mínimo 5 caracteres)' };
  }
  if (!datos.fechaSalida) {
    return { valido: false, mensaje: 'La fecha de salida es obligatoria' };
  }
  if (!datos.horaSalida || !/^([01]\d|2[0-3]):([0-5]\d)$/.test(datos.horaSalida)) {
    return { valido: false, mensaje: 'La hora de salida es obligatoria y debe tener formato HH:MM (24h)' };
  }
  if (!datos.turno || !['Mañana', 'Tarde', 'Noche'].includes(datos.turno)) {
    return { valido: false, mensaje: 'El turno debe ser Mañana, Tarde o Noche' };
  }
  if (!datos.vehiculo || typeof datos.vehiculo !== 'string' || datos.vehiculo.trim().length < 5) {
    return { valido: false, mensaje: 'Los datos del vehículo son obligatorios (mínimo 5 caracteres)' };
  }
  const asientosTotales = Number(datos.asientosTotales);
  if (isNaN(asientosTotales) || asientosTotales < 1 || asientosTotales > 6) {
    return { valido: false, mensaje: 'Los asientos totales deben estar entre 1 y 6' };
  }
  const asientosDisponibles = Number(datos.asientosDisponibles);
  if (isNaN(asientosDisponibles) || asientosDisponibles < 0 || asientosDisponibles > asientosTotales) {
    return { valido: false, mensaje: 'Los asientos disponibles deben estar entre 0 y los asientos totales' };
  }
  const aporte = Number(datos.aporteSugerido);
  if (isNaN(aporte) || aporte < 0 || aporte > 50) {
    return { valido: false, mensaje: 'El aporte sugerido debe estar entre S/ 0 y S/ 50' };
  }
  if (!datos.telefonoContacto || !/^9\d{8}$/.test(datos.telefonoContacto)) {
    return { valido: false, mensaje: 'El teléfono debe ser un celular de 9 dígitos que inicie con 9' };
  }
  if (!datos.autor || typeof datos.autor !== 'string') {
    return { valido: false, mensaje: 'El autor de la publicación es obligatorio' };
  }
  return { valido: true };
}

// 1. GET /rutas
export const listarRutas = (req: Request, res: Response) => {
  const db = getDb();
  res.status(200).json(db.rutas || []);
};

// 2. GET /rutas/:id
export const obtenerRutaPorId = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const db = getDb();
  const ruta = (db.rutas || []).find((r: RutaCarpooling) => r.id === id);

  if (!ruta) {
    return res.status(404).json({ mensaje: 'Ruta no encontrada' });
  }

  res.status(200).json(ruta);
};

// 3. POST /rutas
export const crearRuta = (req: Request, res: Response) => {
  const validacion = validarRuta(req.body);
  if (!validacion.valido) {
    return res.status(400).json({ mensaje: validacion.mensaje });
  }

  const db = getDb();
  if (!db.rutas) {
    db.rutas = [];
  }

  const nuevoId = db.rutas.length > 0 ? Math.max(...db.rutas.map((r: RutaCarpooling) => r.id || 0)) + 1 : 1;

  const nuevaRuta: RutaCarpooling = {
    id: nuevoId,
    origen: req.body.origen.trim(),
    destino: req.body.destino.trim(),
    puntosIntermedios: req.body.puntosIntermedios.trim(),
    fechaSalida: req.body.fechaSalida,
    horaSalida: req.body.horaSalida,
    turno: req.body.turno,
    vehiculo: req.body.vehiculo.trim(),
    asientosTotales: Number(req.body.asientosTotales),
    asientosDisponibles: Number(req.body.asientosDisponibles),
    aporteSugerido: Number(req.body.aporteSugerido),
    telefonoContacto: req.body.telefonoContacto.trim(),
    estado: Number(req.body.asientosDisponibles) === 0 ? 'Completa' : 'Activa',
    autor: req.body.autor.trim(),
    pasajeros: Array.isArray(req.body.pasajeros) ? req.body.pasajeros : [],
    observaciones: req.body.observaciones || ''
  };

  db.rutas.push(nuevaRuta);
  saveDb(db);

  res.status(201).json(nuevaRuta);
};

// 4. PUT /rutas/:id
export const actualizarRuta = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const validacion = validarRuta(req.body);
  if (!validacion.valido) {
    return res.status(400).json({ mensaje: validacion.mensaje });
  }

  const db = getDb();
  const index = (db.rutas || []).findIndex((r: RutaCarpooling) => r.id === id);

  if (index === -1) {
    return res.status(404).json({ mensaje: 'Ruta no encontrada' });
  }

  const rutaActualizada: RutaCarpooling = {
    id,
    origen: req.body.origen.trim(),
    destino: req.body.destino.trim(),
    puntosIntermedios: req.body.puntosIntermedios.trim(),
    fechaSalida: req.body.fechaSalida,
    horaSalida: req.body.horaSalida,
    turno: req.body.turno,
    vehiculo: req.body.vehiculo.trim(),
    asientosTotales: Number(req.body.asientosTotales),
    asientosDisponibles: Number(req.body.asientosDisponibles),
    aporteSugerido: Number(req.body.aporteSugerido),
    telefonoContacto: req.body.telefonoContacto.trim(),
    estado: Number(req.body.asientosDisponibles) === 0 ? 'Completa' : (req.body.estado || 'Activa'),
    autor: req.body.autor || db.rutas[index].autor,
    pasajeros: Array.isArray(req.body.pasajeros) ? req.body.pasajeros : db.rutas[index].pasajeros,
    observaciones: req.body.observaciones ?? db.rutas[index].observaciones
  };

  db.rutas[index] = rutaActualizada;
  saveDb(db);

  res.status(200).json(rutaActualizada);
};

// 5. PATCH /rutas/:id (Para reservar asiento o cancelar asiento)
export const parchearRuta = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const db = getDb();
  const index = (db.rutas || []).findIndex((r: RutaCarpooling) => r.id === id);

  if (index === -1) {
    return res.status(404).json({ mensaje: 'Ruta no encontrada' });
  }

  const ruta = db.rutas[index];

  if (req.body.asientosDisponibles !== undefined) {
    const disponibles = Number(req.body.asientosDisponibles);
    if (isNaN(disponibles) || disponibles < 0 || disponibles > ruta.asientosTotales) {
      return res.status(400).json({ mensaje: 'Cantidad de asientos disponibles inválida' });
    }
    ruta.asientosDisponibles = disponibles;
  }

  if (req.body.pasajeros !== undefined) {
    if (!Array.isArray(req.body.pasajeros)) {
      return res.status(400).json({ mensaje: 'Pasajeros debe ser un arreglo' });
    }
    ruta.pasajeros = req.body.pasajeros;
  }

  if (req.body.estado !== undefined) {
    ruta.estado = req.body.estado;
  } else if (ruta.asientosDisponibles === 0) {
    ruta.estado = 'Completa';
  } else {
    ruta.estado = 'Activa';
  }

  db.rutas[index] = ruta;
  saveDb(db);

  res.status(200).json(ruta);
};

// 6. DELETE /rutas/:id
export const eliminarRuta = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const db = getDb();
  const index = (db.rutas || []).findIndex((r: RutaCarpooling) => r.id === id);

  if (index === -1) {
    return res.status(404).json({ mensaje: 'Ruta no encontrada' });
  }

  const [eliminada] = db.rutas.splice(index, 1);
  saveDb(db);

  res.status(200).json(eliminada);
};
