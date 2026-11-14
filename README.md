# Smart Campus

Proyecto integral **Smart Campus**, estructurado con arquitectura cliente-servidor desacoplada:

- **Frontend**: Aplicación SPA desarrollada con Angular 19.
- **Backend**: Servidor API REST desarrollado con Express, TypeScript y Node.js.

---

## Estructura del Proyecto

```
jsa-proy-smart-campus/
├── backend/                  # Servidor Express API REST (TypeScript)
│   ├── data/
│   │   └── db.json           # Origen de datos JSON inicial
│   ├── src/
│   │   └── index.ts          # Servidor Express con TypeScript
│   ├── .env.example          # Plantilla de variables de entorno
│   ├── package.json          # Dependencias y scripts
│   ├── tsconfig.json         # Configuración TypeScript
│   └── README.md
│
├── frontend/                 # Aplicación Angular 19
│   ├── src/                  # Código fuente (componentes, servicios, vistas)
│   ├── angular.json          # Configuración de Angular CLI
│   ├── package.json          # Dependencias del frontend
│   └── README.md
│
├── .gitignore                # Reglas de exclusión de Git
└── README.md                 # Documentación general
```

---

## Guía rápida de inicio

Al clonar este repositorio por primera vez, sigue estos pasos:

### 1. Clonar el repositorio

```bash
git clone https://github.com/victorfloresdev/jsa-proy-smart-campus.git
cd jsa-proy-smart-campus
```

### 2. Configurar y levantar el Backend

Abre una terminal:

```bash
cd backend
npm install
npm run dev
```

El backend se iniciará en `http://localhost:3000`.

### 3. Configurar y levantar el Frontend

Abre otra terminal:

```bash
cd frontend
npm install
npm start
```

El frontend estará disponible en `http://localhost:4200` y se conectará automáticamente al backend en `http://localhost:3000`.

---

## Módulos y Funcionalidades

- **Carpooling**: Publicación, búsqueda y reserva de asientos en viajes compartidos hacia el campus.
- **Cafetería**: Consulta y registro de pedidos.
- **Tickets**: Gestión de soporte e incidencias técnicas en campus.
- **Objetos Perdidos**: Tablero de reportes de objetos extraviados.
- **Reservas**: Vista y disponibilidad de ambientes y salas.
