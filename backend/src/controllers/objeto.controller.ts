import { Request, Response } from 'express';
import {
  getDb,
  NuevoObjeto,
  ObjetoPerdido,
  saveDb,
} from '../models/objeto.model';

const esRegistro = (valor: unknown): valor is Record<string, unknown> =>
  typeof valor === 'object' && valor !== null;

const esTexto = (valor: unknown): valor is string =>
  typeof valor === 'string' && valor.trim().length > 0;

const esNuevoObjeto = (valor: unknown): valor is NuevoObjeto => {
  if (!esRegistro(valor)) {
    return false;
  }

  return (
    esTexto(valor.titulo) &&
    valor.titulo.trim().length >= 3 &&
    (valor.tipo === 'Perdido' || valor.tipo === 'Encontrado') &&
    esTexto(valor.categoria) &&
    esTexto(valor.ubicacion) &&
    esTexto(valor.fechaSuceso) &&
    esTexto(valor.descripcion) &&
    valor.descripcion.trim().length >= 8 &&
    esTexto(valor.imagenUrl) &&
    valor.estado === 'Activo' &&
    esTexto(valor.contacto) &&
    esTexto(valor.autor)
  );
};

const obtenerId = (parametro: string | string[]): number | null => {
  if (Array.isArray(parametro)) {
    return null;
  }

  const id = Number(parametro);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
};

export const listarObjetos = (_req: Request, res: Response): void => {
  const db = getDb();
  res.json(db.objetos ?? []);
};

export const crearObjeto = (req: Request, res: Response): void => {
  const cuerpo: unknown = req.body;

  if (!esNuevoObjeto(cuerpo)) {
    res.status(400).json({ message: 'Datos del objeto no válidos' });
    return;
  }

  const db = getDb();
  const objetos = db.objetos ?? [];
  const nuevoObjeto: ObjetoPerdido = {
    id: Math.max(0, ...objetos.map((objeto) => objeto.id)) + 1,
    ...cuerpo,
  };

  db.objetos = [...objetos, nuevoObjeto];
  saveDb(db);
  res.status(201).json(nuevoObjeto);
};

export const marcarRecuperado = (req: Request, res: Response): void => {
  const id = obtenerId(req.params.id);

  if (id === null) {
    res.status(400).json({ message: 'Identificador de objeto no válido' });
    return;
  }

  const db = getDb();
  const objetos = db.objetos ?? [];
  const indice = objetos.findIndex((objeto) => objeto.id === id);

  if (indice === -1) {
    res.status(404).json({ message: 'Objeto no encontrado' });
    return;
  }

  const objetoActualizado: ObjetoPerdido = {
    ...objetos[indice],
    estado: 'Recuperado',
  };

  db.objetos = objetos.map((objeto, posicion) =>
    posicion === indice ? objetoActualizado : objeto
  );
  saveDb(db);
  res.json(objetoActualizado);
};

export const eliminarObjeto = (req: Request, res: Response): void => {
  const id = obtenerId(req.params.id);

  if (id === null) {
    res.status(400).json({ message: 'Identificador de objeto no válido' });
    return;
  }

  const db = getDb();
  const objetos = db.objetos ?? [];

  if (!objetos.some((objeto) => objeto.id === id)) {
    res.status(404).json({ message: 'Objeto no encontrado' });
    return;
  }

  db.objetos = objetos.filter((objeto) => objeto.id !== id);
  saveDb(db);
  res.status(204).send();
};
