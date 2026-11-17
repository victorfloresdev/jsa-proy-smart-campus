import { Request, Response } from 'express';
import { getDb, saveDb, RutaCarpooling } from '../models/carpooling.model';

export function validarRuta(datos: any): { valido: boolean; mensaje?: string } {
  if (!datos.origen || typeof datos.origen !== 'string' || datos.origen.trim().length < 3) {
    return { valido: false, mensaje: 'El origen es obligatorio y debe tener al menos 3 caracteres' };
  }
  if (!datos.destino || typeof datos.destino !== 'string' || datos.destino.trim().length < 3) {
    return { valido: false, mensaje: 'El destino es obligatorio y debe tener al menos 3 caracteres' };
  }
  if (!datos.fecha) {
    return { valido: false, mensaje: 'La fecha es obligatoria' };
  }
  if (!datos.hora) {
    return { valido: false, mensaje: 'La hora es obligatoria' };
  }
  if (!datos.vehiculo || typeof datos.vehiculo !== 'string' || datos.vehiculo.trim().length < 3) {
    return { valido: false, mensaje: 'El vehículo es obligatorio (mínimo 3 caracteres)' };
  }
  const cupos = Number(datos.cupos);
  if (isNaN(cupos) || cupos < 0 || cupos > 10) {
    return { valido: false, mensaje: 'Los cupos deben ser un número entre 0 y 10' };
  }
  const precio = Number(datos.precio);
  if (isNaN(precio) || precio < 0) {
    return { valido: false, mensaje: 'El precio debe ser un número mayor o igual a 0' };
  }
  if (!datos.contacto || !/^9\d{8}$/.test(datos.contacto)) {
    return { valido: false, mensaje: 'El contacto debe ser un celular de 9 dígitos que inicie con 9' };
  }
  if (!datos.conductor) {
    return { valido: false, mensaje: 'El conductor es obligatorio' };
  }
  return { valido: true };
}

// 1. GET /rutas
export const listarRutas = (req: Request, res: Response) => {
  const rutas = getDb().rutas || [];
  res.status(200).json(rutas);
};

// 2. GET /rutas/:id
export const obtenerRutaPorId = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const rutas = getDb().rutas || [];
  const ruta = (rutas).find((r: RutaCarpooling) => r.id === id);

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
  if (!db.rutas) db.rutas = [];

  const nuevoId = db.rutas.length > 0 ? Math.max(...db.rutas.map((r: RutaCarpooling) => r.id || 0)) + 1 : 1;

  const nuevaRuta: RutaCarpooling = {
    id: nuevoId,
    origen: req.body.origen.trim(),
    destino: req.body.destino.trim(),
    fecha: req.body.fecha,
    hora: req.body.hora,
    vehiculo: req.body.vehiculo.trim(),
    cupos: Number(req.body.cupos),
    precio: Number(req.body.precio),
    contacto: req.body.contacto.trim(),
    conductor: req.body.conductor.trim()
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
    fecha: req.body.fecha,
    hora: req.body.hora,
    vehiculo: req.body.vehiculo.trim(),
    cupos: Number(req.body.cupos),
    precio: Number(req.body.precio),
    contacto: req.body.contacto.trim(),
    conductor: req.body.conductor.trim()
  };

  db.rutas[index] = rutaActualizada;
  saveDb(db);

  res.status(200).json(rutaActualizada);
};

// 5. PATCH /rutas/:id (Para reservar asiento o actualizar cupos)
export const parchearRuta = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const db = getDb();
  const index = (db.rutas || []).findIndex((r: RutaCarpooling) => r.id === id);

  if (index === -1) {
    return res.status(404).json({ mensaje: 'Ruta no encontrada' });
  }

  const ruta = db.rutas[index];

  // Si se solicita reservar, se descuenta 1 cupo
  if (req.body.reservar === true) {
    if (ruta.cupos <= 0) {
      return res.status(400).json({ mensaje: 'No hay cupos disponibles' });
    }
    ruta.cupos -= 1;
  } else if (req.body.cupos !== undefined) {
    const nuevosCupos = Number(req.body.cupos);
    if (isNaN(nuevosCupos) || nuevosCupos < 0) {
      return res.status(400).json({ mensaje: 'Cupos inválidos' });
    }
    ruta.cupos = nuevosCupos;
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
