# SmartCampus - Backend (Express + TypeScript)

Proyecto base de Express con TypeScript para la plataforma Smart Campus.

## Requisitos previos

- Node.js (v18 o superior)
- npm (v9 o superior)

## Instalación de dependencias

```bash
cd backend
npm install
```

## Servidor de desarrollo

```bash
npm run dev
```

El servidor estará escuchando en `http://localhost:3000`.

## Compilación y producción

Para compilar TypeScript a JavaScript:

```bash
npm run build
```

Para iniciar el servidor compilado:

```bash
npm start
```

## Estructura

```
backend/
├── src/
│   ├── app.ts          # Configuración de Express, middlewares y rutas
│   ├── server.ts       # Punto de entrada y arranque del servidor
│   ├── controllers/    # Controladores de la aplicación
│   ├── models/         # Modelos e interfaces
│   ├── routes/         # Definición de rutas y endpoints
│   └── data/
│       └── db.json     # Origen de datos JSON inicial
├── .env.example
├── .gitignore
├── package.json
└── tsconfig.json
```
