# YouNowApp

Aplicación web construida con Angular para la gestión de clientes, productos y dashboard administrativo.

## 🚀 Stack Tecnológico

- **Angular** 20.3.0
- **TypeScript** 5.9.2
- **Tailwind CSS** 3.4.14
- **RxJS** 7.8.0
- **Jasmine & Karma** - Testing

## 📋 Requisitos Previos

- Node.js (versión LTS recomendada)
- npm o yarn
- Angular CLI 20.3.4

## 🔧 Instalación

1. Clonar el repositorio:
```bash
git clone <repository-url>
cd YouNowApp
```

2. Instalar dependencias:
```bash
npm install
```

## 🎯 Scripts Disponibles

### Desarrollo
```bash
npm start
```
Inicia el servidor de desarrollo con proxy configurado en `http://localhost:4200/`

### Build
```bash
npm run build
```
Genera la versión de producción optimizada en el directorio `dist/`

### Tests
```bash
npm test
```
Ejecuta las pruebas unitarias con Karma

### Watch Mode
```bash
npm run watch
```
Compila el proyecto en modo desarrollo con observación de cambios

### Tailwind Init
```bash
npm run tailwind:init
```
Inicializa la configuración de Tailwind CSS

## 📁 Estructura del Proyecto

```
YouNowApp/
├── src/
│   ├── app/
│   │   ├── layout/
│   │   │   └── sidebar/          # Componente de barra lateral
│   │   ├── pages/
│   │   │   ├── dashboard/        # Página principal del dashboard
│   │   │   ├── customers/        # Gestión de clientes
│   │   │   └── products/         # Gestión de productos
│   │   ├── services/
│   │   │   ├── address.service.ts    # Servicio de direcciones
│   │   │   ├── customer.service.ts   # Servicio de clientes
│   │   │   └── product.service.ts    # Servicio de productos
│   │   ├── shared/
│   │   │   └── components/       # Componentes compartidos
│   │   ├── app.config.ts         # Configuración de la aplicación
│   │   ├── app.routes.ts         # Definición de rutas
│   │   └── app.ts                # Componente raíz
│   ├── environments/
│   │   ├── environment.ts        # Variables de entorno (dev)
│   │   └── environment.prod.ts   # Variables de entorno (prod)
│   ├── index.html
│   ├── main.ts
│   └── styles.css                # Estilos globales + Tailwind
├── public/                       # Recursos estáticos
├── angular.json                  # Configuración de Angular
├── proxy.conf.json              # Configuración del proxy
├── tailwind.config.js           # Configuración de Tailwind
└── tsconfig.json                # Configuración de TypeScript
```

## 🔌 Configuración del Proxy

El proyecto está configurado para hacer proxy de las peticiones `/api` hacia `http://localhost:3000`. Esto permite el desarrollo con un backend local sin problemas de CORS.

Configuración en `proxy.conf.json`:
```json
{
  "/api": {
    "target": "http://localhost:3000",
    "secure": false,
    "changeOrigin": true
  }
}
```

## 🗺️ Rutas de la Aplicación

- `/` → Redirige a `/dashboard`
- `/dashboard` → Panel principal
- `/customers` → Gestión de clientes
- `/products` → Gestión de productos

## 🎨 Estilos

El proyecto utiliza **Tailwind CSS** para el diseño y estilos. La configuración está en `tailwind.config.js` y los estilos globales en `src/styles.css`.

## 📝 Formato de Código

Se utiliza Prettier con la siguiente configuración:
- Print width: 100 caracteres
- Single quotes habilitadas
- Parser especial para archivos HTML de Angular

## 🏗️ Build de Producción

El build de producción incluye:
- Optimización de archivos
- Hashing de archivos para cache
- Source maps deshabilitados
- Budgets de tamaño:
  - Initial: max 1MB
  - Component styles: max 8kB

## 📚 Recursos Adicionales

- [Documentación de Angular](https://angular.dev)
- [Angular CLI](https://angular.dev/tools/cli)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [RxJS](https://rxjs.dev)
