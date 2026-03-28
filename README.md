# YouNowApp

Aplicacion web construida con Angular para la gestion de clientes, productos y direcciones con un dashboard administrativo. Orientada al mercado colombiano con soporte de locale `es-CO`.

---

## Stack Tecnologico

| Capa | Tecnologia | Version |
|------|-----------|---------|
| **Frontend** | Angular (Standalone Components) | 20.3.0 |
| **Lenguaje** | TypeScript | 5.9.2 |
| **Estilos** | Tailwind CSS + PostCSS + Autoprefixer | 3.4.14 |
| **Reactividad** | RxJS | 7.8.0 |
| **Build** | Angular CLI + Vite | 20.3.4 |
| **Testing** | Karma + Jasmine | 6.4.0 / 5.9.0 |
| **Backend** | API REST (Node.js/Express en localhost:3000) | - |
| **Internacionalizacion** | Locale es-CO (Spanish Colombia) | - |

---

## Arquitectura del Proyecto

### Patron General

La aplicacion sigue una arquitectura **Component-Service** basada en **Standalone Components** de Angular 14+:

- **Componentes** (`pages/`, `layout/`, `shared/`) - Capa de presentacion. Cada componente gestiona su propio estado local.
- **Servicios** (`services/`) - Capa de datos. Se comunican con la API REST via `HttpClient` y exponen Observables.
- **Directivas** (`directives/`) - Logica reutilizable de DOM (ej: formateo de precios).
- **Guards** (`guards/`) - Proteccion de rutas privadas.
- **Interceptores** (`interceptors/`) - Middleware HTTP para adjuntar tokens de autenticacion.
- **Rutas** (`app.routes.ts`) - Navegacion con rutas publicas y protegidas.

```
┌─────────────────────────────────────────────────┐
│                   Angular App                    │
│                                                  │
│  ┌──────────────────────────────────────────┐   │
│  │             MainLayoutComponent           │   │
│  │  ┌──────────┐   ┌──────────────────────┐ │   │
│  │  │ Sidebar  │   │     Router View       │ │   │
│  │  │(+ logout)│   │   (pages protegidas)  │ │   │
│  │  │(+ theme) │   └──────────┬───────────┘ │   │
│  │  └──────────┘              │             │   │
│  └──────────────────────────┼─────────────-┘   │
│                              │                   │
│               ┌──────────────┼──────────┐        │
│               │              │          │        │
│         ┌─────▼──┐  ┌───────▼─┐ ┌──────▼──┐    │
│         │Dashboard│  │Products │ │Customers│    │
│         └────────┘  └────┬────┘ └────┬────┘    │
│                           │          │          │
│              ┌────────────▼──────────▼──┐       │
│              │         Services          │       │
│              │  AuthService  ThemeService│       │
│              │  ProductService           │       │
│              │  CustomerService          │       │
│              │  AddressService           │       │
│              └────────────┬─────────────┘       │
│                            │                     │
│              ┌─────────────▼─────────────┐       │
│              │      AuthInterceptor       │       │
│              │   (adjunta Bearer token)   │       │
│              └─────────────┬─────────────┘       │
└────────────────────────────┼────────────────────-┘
                             │
                 ┌───────────▼───────────┐
                 │   API REST Backend    │
                 │  localhost:3000/api   │
                 └───────────────────────┘
```

### Standalone Components

Todos los componentes usan `standalone: true` (sin NgModules). Las dependencias se importan directamente en cada componente:

```typescript
@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  // ...
})
```

### Gestion de Estado

No se usa libreria de estado centralizado (NgRx, Akita, etc.). El patron es:

1. **Estado local en componentes** - Propiedades del componente (`products: Product[] = []`, `loading = true`)
2. **RxJS Subjects** - Para busqueda reactiva con `debounceTime(500)` y `distinctUntilChanged()`
3. **Servicios como proveedores de datos** - Inyectados con `providedIn: 'root'` (singleton)
4. **@Input/@Output** - Comunicacion padre-hijo (ej: `CustomersComponent` -> `AddressComponent`)

### Formularios

Se utiliza **Template-driven Forms** con `FormsModule` y binding bidireccional `[(ngModel)]`. Validacion basica con atributos HTML (`required`).

---

## Estructura del Proyecto

```
YouNowApp/
├── src/
│   ├── app/
│   │   ├── directives/
│   │   │   └── price-format.directive.ts    # Directiva de formateo de precios (ControlValueAccessor)
│   │   ├── guards/
│   │   │   └── auth.guard.ts                # Guard que protege rutas privadas (redirige a /login)
│   │   ├── interceptors/
│   │   │   └── auth.interceptor.ts          # Adjunta Bearer token y maneja errores 401
│   │   ├── layout/
│   │   │   ├── main-layout/
│   │   │   │   └── main-layout.component.ts # Layout con sidebar para rutas autenticadas
│   │   │   └── sidebar/                     # Barra lateral con navegacion, dark mode y logout
│   │   ├── pages/
│   │   │   ├── customers/                   # Gestion de clientes
│   │   │   │   └── address/                 # Sub-componente de direcciones
│   │   │   ├── dashboard/                   # Panel principal
│   │   │   ├── login/                       # Pagina de autenticacion
│   │   │   └── products/                    # Catalogo de productos
│   │   ├── services/
│   │   │   ├── auth.service.ts              # Login, logout, getToken, isAuthenticated
│   │   │   ├── theme.service.ts             # Toggle dark/light mode con persistencia en localStorage
│   │   │   ├── product.service.ts           # CRUD de productos
│   │   │   ├── customer.service.ts          # CRUD de clientes
│   │   │   └── address.service.ts           # CRUD de direcciones
│   │   ├── shared/
│   │   │   └── components/
│   │   │       └── navbar/                  # Navbar compartido
│   │   ├── app.ts                           # Componente raiz (solo router-outlet)
│   │   ├── app.routes.ts                    # Rutas publicas y protegidas
│   │   ├── app.config.ts                    # Configuracion con provideHttpClient + interceptores
│   │   └── app.css                          # Estilos del componente raiz
│   ├── environments/
│   │   ├── environment.ts                   # Config desarrollo (localhost:3000)
│   │   └── environment.prod.ts              # Config produccion
│   ├── index.html                           # Punto de entrada HTML
│   ├── main.ts                              # Bootstrap de la aplicacion
│   └── styles.css                           # Estilos globales + Tailwind directives
├── public/                                  # Recursos estaticos
├── angular.json                             # Configuracion de Angular CLI
├── proxy.conf.json                          # Proxy de desarrollo (/api -> :3000)
├── tailwind.config.js                       # Configuracion de Tailwind CSS (darkMode: 'class')
├── postcss.config.js                        # Pipeline de CSS
├── tsconfig.json                            # Configuracion TypeScript
├── tsconfig.app.json                        # TS config para la app
└── package.json                             # Dependencias y scripts
```

---

## Autenticacion

La aplicacion implementa autenticacion con **JWT (JSON Web Token)** contra el endpoint `POST /api/auth/login`.

### Flujo de autenticacion

```
Usuario accede a ruta protegida
        │
        ▼
    AuthGuard
   ¿Hay token?
   /         \
  No          Si
  │           │
  ▼           ▼
/login    Acceso permitido
  │
  ▼
Login exitoso → token en localStorage → redirige a /dashboard
```

### Componentes del sistema de auth

| Archivo | Responsabilidad |
|---------|----------------|
| `services/auth.service.ts` | Login HTTP, logout, almacenamiento del token en `localStorage` |
| `guards/auth.guard.ts` | Redirige a `/login` si no hay token valido |
| `interceptors/auth.interceptor.ts` | Adjunta `Authorization: Bearer <token>` a todos los requests; redirige a `/login` en respuesta 401 |
| `pages/login/login.component.ts` | Formulario de login, manejo de errores de credenciales |
| `layout/main-layout/main-layout.component.ts` | Wrapper con sidebar para todas las rutas autenticadas |

### Token

- Se almacena en `localStorage` bajo la clave `auth_token`
- Duracion: 8 horas (definida por el backend)
- Se elimina automaticamente al hacer logout o al recibir un error 401

---

## Modo Oscuro

La aplicacion soporta **modo oscuro configurable** mediante un boton de alternancia en el sidebar.

### Implementacion

Se usa la estrategia `darkMode: 'class'` de Tailwind CSS. Cuando el modo oscuro esta activo, se agrega la clase `dark` al elemento `<html>`, activando todas las variantes `dark:` definidas en los templates.

| Archivo | Responsabilidad |
|---------|----------------|
| `tailwind.config.js` | `darkMode: 'class'` habilitado |
| `services/theme.service.ts` | Toggle del tema, aplica/remueve clase `dark` en `document.documentElement` |
| `layout/sidebar/sidebar.component.html` | Boton de alternancia con icono dinamico (🌙 / ☀️) |

### Persistencia

La preferencia se guarda en `localStorage` bajo la clave `theme`. Al recargar la pagina, el tema se restaura automaticamente.

---

## Capa de Servicios (API)

Todos los servicios siguen convenciones REST y usan `HttpClient` de Angular. Los requests a rutas protegidas del backend llevan el token JWT adjuntado automaticamente por el `AuthInterceptor`.

### AuthService (`services/auth.service.ts`)

| Metodo | Descripcion |
|--------|-------------|
| `login(username, password)` | POST `/api/auth/login`, guarda token en localStorage |
| `logout()` | Elimina token y redirige a `/login` |
| `getToken()` | Retorna el token almacenado o `null` |
| `isAuthenticated()` | Retorna `true` si existe un token |

### ProductService (`services/product.service.ts`)

| Metodo | HTTP | Endpoint | Descripcion |
|--------|------|----------|-------------|
| `getProducts()` | GET | `/api/products` | Listar todos |
| `getProductById(id)` | GET | `/api/products/:id` | Obtener por ID |
| `getProductForFilter(filters)` | GET | `/api/products?params` | Busqueda con filtros dinamicos |
| `createProduct(product)` | POST | `/api/products` | Crear producto |
| `updateProduct(id, product)` | PUT | `/api/products/:id` | Actualizar completo |
| `updateProductPartial(id, product)` | PATCH | `/api/products/:id` | Actualizar parcial |
| `deleteProduct(id)` | DELETE | `/api/products/:id` | Eliminar producto |
| `deactiveProduct(id)` | PATCH | `/api/products/:id/deactivate` | Desactivar (soft delete) |

### CustomerService (`services/customer.service.ts`)

| Metodo | HTTP | Endpoint | Descripcion |
|--------|------|----------|-------------|
| `getCustomers()` | GET | `/api/customers` | Listar todos |
| `getCustomerById(id)` | GET | `/api/customers/:id` | Obtener por ID |
| `getCustomerByPhone(phone)` | GET | `/api/customers/phone/:phone` | Buscar por telefono |
| `createCustomer(customer)` | POST | `/api/customers` | Crear cliente |
| `updateCustomer(id, customer)` | PUT | `/api/customers/:id` | Actualizar cliente |
| `deleteCustomer(id)` | DELETE | `/api/customers/:id` | Eliminar cliente |

### AddressService (`services/address.service.ts`)

| Metodo | HTTP | Endpoint | Descripcion |
|--------|------|----------|-------------|
| `getAddressesByCustomerId(id)` | GET | `/api/addresses/customer/:id` | Direcciones por cliente |
| `getPrimaryAddress(customerId)` | GET | `/api/addresses/primary/:id` | Direccion principal |
| `createAddress(address)` | POST | `/api/addresses` | Crear direccion |
| `updateAddress(id, address)` | PATCH | `/api/addresses/:id` | Actualizar direccion |
| `deleteAddress(id)` | DELETE | `/api/addresses/:id` | Eliminar direccion |

### Modelos de Datos

```typescript
interface Product {
  id?: number;
  name: string;
  description?: string;
  price: number;
  is_active: boolean;
}

interface Customer {
  id?: number;
  name: string;
  phone: string;
  email?: string;
  created_at?: string;
}

interface Address {
  id?: number;
  customer_id: number;
  label: string;
  address_text: string;
  reference?: string | null;
  latitude?: number;
  longitude?: number;
  created_at?: string;
  is_primary: boolean;
}
```

---

## Rutas de la Aplicacion

| Ruta | Componente | Protegida | Estado |
|------|-----------|-----------|--------|
| `/login` | LoginComponent | No | Activa |
| `/` | Redirige a `/dashboard` | Si | Activa |
| `/dashboard` | DashboardComponent | Si | Activa |
| `/customers` | CustomersComponent | Si | Activa |
| `/products` | ProductsComponent | Si | Activa |
| `/pedidos` | - | Si | Planeada |
| `/validar-pagos` | - | Si | Planeada |
| `/domiciliarios` | - | Si | Planeada |
| `/conciliacion` | - | Si | Planeada |
| `/configuracion` | - | Si | Planeada |

Las rutas protegidas usan `canActivate: [authGuard]` a nivel del `MainLayoutComponent`, por lo que todas las rutas hijas quedan protegidas automaticamente.

---

## Patrones y Decisiones Tecnicas

### Busqueda Reactiva con Debounce
Los componentes de productos y clientes implementan busqueda reactiva con RxJS para evitar llamadas excesivas al API:
```typescript
private searchSubject = new Subject<string>();

ngOnInit() {
  this.searchSubject
    .pipe(debounceTime(500), distinctUntilChanged())
    .subscribe(() => this.searchProduct());
}
```

### Locale Colombiano
La aplicacion esta configurada globalmente con locale `es-CO` para formateo de fechas, moneda y numeros:
```typescript
import localeEs from '@angular/common/locales/es-CO';
registerLocaleData(localeEs);
// Provider: { provide: LOCALE_ID, useValue: 'es-CO' }
```

### Directiva de Formateo de Precios
Directiva personalizada que implementa `ControlValueAccessor` para formatear precios en formato de peso colombiano (separador de miles: `.`, decimal: `,`).

### Modales y Formularios
Patron de modales basado en flags booleanos del componente (`showForm`, `showAddressModal`). Se determina si es creacion o edicion segun la existencia de `editingProduct`/`editingCustomer`.

### HTTP Interceptor
Se usa `provideHttpClient(withInterceptors([authInterceptor]))` en `app.config.ts` en lugar del legacy `HttpClientModule`, siguiendo las convenciones de Angular 17+:
```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    { provide: LOCALE_ID, useValue: 'es-CO' }
  ],
};
```

---

## Configuracion del Proxy

El proxy de desarrollo redirige `/api` al backend en `localhost:3000`:

```json
{
  "/api": {
    "target": "http://localhost:3000",
    "secure": false,
    "changeOrigin": true
  }
}
```

> El backend debe tener configurada la variable `FRONTEND_URL=http://localhost:4200` en su `.env` para permitir las peticiones CORS.

---

## Requisitos Previos

- Node.js (version LTS recomendada)
- npm
- Angular CLI 20.3.4
- Backend yum-now-api corriendo en `localhost:3000`

## Instalacion

```bash
git clone <repository-url>
cd YouNowApp
npm install
```

## Scripts Disponibles

| Script | Comando | Descripcion |
|--------|---------|-------------|
| Desarrollo | `npm start` | Servidor de desarrollo con proxy en `http://localhost:4200/` |
| Build | `npm run build` | Build de produccion optimizado en `dist/` |
| Tests | `npm test` | Pruebas unitarias con Karma |
| Watch | `npm run watch` | Build en modo desarrollo con watch |

## Build de Produccion

- Optimizacion y minificacion de archivos
- Hashing para cache busting
- Source maps deshabilitados
- Budgets: Initial max 1MB, Component styles max 8kB

## Formato de Codigo

Prettier configurado con:
- Print width: 100 caracteres
- Single quotes habilitadas
- Parser especial para HTML de Angular

---

## Recursos

- [Angular](https://angular.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [RxJS](https://rxjs.dev)
