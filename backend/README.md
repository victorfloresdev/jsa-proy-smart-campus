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
├── data/
│   └── db.json         # Archivo de datos db.json
├── src/
│   └── index.ts        # Punto de entrada inicial Express (TypeScript)
├── .env.example
├── .gitignore
├── package.json
└── tsconfig.json
```
