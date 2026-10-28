# 🛍️ Mercado Seguro: frontend e-commerce en Next.js

Frontend en **Next.js 16 (App Router) + TypeScript + Tailwind CSS 4** que consume la
[API REST de e-commerce](https://github.com/Renderos/ecommerce_api) (Laravel 12 + Sanctum + Swagger + Stripe).
Implementa el flujo completo de compra: catálogo → carrito → orden → pago con Stripe → confirmación → historial.

> Actividad evaluada: *Optimización avanzada de rendimiento: Web Vitals y mutaciones asíncronas en el servidor.*

---

## 📋 Tabla de contenidos

1. [Stack](#-stack)
2. [Requisitos](#-requisitos)
3. [Configuración (.env)](#-configuración-env)
4. [Ejecutar el proyecto](#-ejecutar-el-proyecto)
5. [Rutas implementadas](#-rutas-implementadas)
6. [Endpoints de la API consumidos](#-endpoints-de-la-api-consumidos)
7. [Arquitectura](#-arquitectura)
8. [Seguridad](#-seguridad)
9. [Rendimiento y resiliencia](#-rendimiento-y-resiliencia)
10. [Probar el flujo completo de compra](#-probar-el-flujo-completo-de-compra)
11. [Estructura del proyecto](#-estructura-del-proyecto)

---

## 🧰 Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16.4 (App Router, Turbopack, **Cache Components + Partial Prerendering**) |
| Lenguaje | TypeScript 5 |
| Estilos | Tailwind CSS 4 (tokens de color con modo oscuro automático) |
| Lecturas | Server Components + `fetch` en el servidor (`"use cache"` + `cacheTag`) |
| Mutaciones | Server Actions (`useActionState`, `useFormStatus`) |
| Sesión | Cookie **httpOnly** con el token Bearer de Sanctum + `proxy.ts` (antes *middleware*) |
| Pagos | Stripe (modo prueba) a través del endpoint `POST /api/orders/{id}/pay` |

## ✅ Requisitos

- Node.js **20.9+** (probado con Node 22) y npm
- La API Laravel corriendo (por defecto en `http://localhost:8000`), con migraciones, seeders y claves de Stripe de prueba configuradas en su `.env`

## ⚙️ Configuración (.env)

Copia el archivo de ejemplo:

```bash
cp .env.example .env.local
```

`.env.example`:

```env
# URL base de la API Laravel (incluye el prefijo /api). Solo se usa en el servidor:
# el navegador nunca habla directo con la API ni ve el token.
API_BASE_URL=http://localhost:8000/api
```

| Variable | Descripción | Ejemplo |
|---|---|---|
| `API_BASE_URL` | URL base de la API, **sin** barra final | `http://localhost:8000/api` o `https://tu-api.up.railway.app/api` |

> La variable **no** lleva el prefijo `NEXT_PUBLIC_` a propósito: solo existe en el servidor de Next.js.

## 🚀 Ejecutar el proyecto

```bash
# 1. Levantar la API (en el repositorio de la API)
php artisan migrate --seed
php artisan serve            # http://localhost:8000  ·  Swagger: /api/documentation

# 2. Instalar dependencias del frontend
npm install

# 3. Configurar la URL de la API
cp .env.example .env.local

# 4a. Modo desarrollo
npm run dev                  # http://localhost:3000

# 4b. Modo producción (el que se usa para medir con Lighthouse)
npm run build
npm run start
```

Usuarios de prueba (creados por los seeders de la API):

| Rol | Email | Contraseña |
|---|---|---|
| Cliente | `cliente@ecommerce.test` | `Cliente123!` |

También puedes crear una cuenta nueva en `/register`.

## 🗺️ Rutas implementadas

| Ruta | Acceso | Descripción | `loading.tsx` | `error.tsx` | `<Suspense>` |
|---|---|---|:-:|:-:|:-:|
| `/` | Público | **Catálogo**: búsqueda, filtro por categoría, orden, solo con stock, paginación | ✅ | ✅ | ✅ filtros + listado |
| `/products/[id]` | Público | **Detalle** de producto, cantidad y *agregar al carrito* | ✅ | ✅ | ✅ |
| `/cart` | Público | **Carrito** en estado local (persistido en `localStorage`, sincronizado entre pestañas) | – | – | – |
| `/login` | Invitado | **Inicio de sesión** (Server Action → cookie httpOnly) | – | – | ✅ |
| `/register` | Invitado | **Registro** (Server Action → cookie httpOnly) | – | – | ✅ |
| `/checkout` | 🔒 Protegido | Dirección de envío y **creación de la orden** (Server Action) | ✅ | ✅ | ✅ |
| `/checkout/[orderId]` | 🔒 Protegido | **Pago con Stripe** (Server Action) y cancelación de la orden | ✅ | ✅ | ✅ |
| `/checkout/[orderId]/success` | 🔒 Protegido | **Confirmación de compra** (solo si la API reporta `paid`) | ✅ | ✅ | ✅ |
| `/orders` | 🔒 Protegido | **Historial de compras** con filtro por estado y paginación | ✅ | ✅ | ✅ listado |
| `/orders/[id]` | 🔒 Protegido | Detalle de la orden, último pago, reintentar pago / cancelar | ✅ | ✅ | ✅ |
| `POST /api/auth/logout` | Route Handler | Revoca el token en la API y elimina las cookies | – | – | – |

## 🔌 Endpoints de la API consumidos

| Método | Endpoint | Dónde se usa | Tipo |
|---|---|---|---|
| `GET` | `/api/products` | Catálogo y categorías | Lectura (Server Component, cacheada) |
| `GET` | `/api/products/{id}` | Detalle de producto | Lectura (Server Component, cacheada) |
| `POST` | `/api/auth/register` | `/register` | Mutación (Server Action) |
| `POST` | `/api/auth/login` | `/login` | Mutación (Server Action) |
| `POST` | `/api/auth/logout` | Botón *Salir* | Mutación (Route Handler) |
| `POST` | `/api/orders` | `/checkout` | Mutación (Server Action) |
| `POST` | `/api/orders/{id}/pay` | `/checkout/[orderId]` | Mutación (Server Action) |
| `POST` | `/api/orders/{id}/cancel` | `/checkout/[orderId]`, `/orders/[id]` | Mutación (Server Action) |
| `GET` | `/api/orders` | `/orders` | Lectura protegida (dinámica) |
| `GET` | `/api/orders/{id}` | Pago, confirmación y detalle | Lectura protegida (dinámica) |

## 🏗️ Arquitectura

```
Navegador ──(cookie httpOnly)──▶ Next.js (Server Components / Server Actions) ──(Bearer token)──▶ API Laravel ──▶ Stripe
```

- **Lecturas en el servidor.** `lib/data.ts` concentra el acceso a datos. El catálogo usa `"use cache"`
  con `cacheTag("products")` / `cacheTag("product:{id}")` y `cacheLife("minutes")`. Los datos del usuario
  (órdenes) son dinámicos: se leen en cada request con el token de la cookie.
- **Mutaciones con Server Actions** (`app/actions/*.ts`): login, registro, crear orden, pagar y cancelar.
  Los formularios usan `useActionState` para mostrar errores de validación de la API campo por campo y
  `useFormStatus` para el estado *pending* del botón.
- **Interfaz siempre actualizada después de mutar:**
  - `updateTag("products")` y `updateTag("product:{id}")` al crear/cancelar una orden, porque la API reserva o
    libera stock. *Read-your-own-writes*: la siguiente visita espera datos frescos (verificado: el stock del
    producto pasa de 50 a 49 tras crear la orden).
  - `revalidatePath("/orders")`, `revalidatePath("/orders/{id}")` y `revalidatePath("/checkout/{id}")` después de
    crear, pagar (aprobado **o rechazado**) o cancelar, para invalidar el Router Cache del cliente.
- **Carrito en estado local** (`components/cart-store.ts`): store externo con `useSyncExternalStore`
  persistido en `localStorage`. Solo se envían `product_id` y `quantity` a la API: **los precios y totales
  los calcula la API**, nunca el cliente.
- **Pago:** la Server Action llama a `POST /api/orders/{id}/pay` con un *PaymentMethod* de prueba de Stripe
  (`pm_card_visa`, `pm_card_chargeDeclined`, etc.). La API crea y confirma el PaymentIntent del lado del servidor.
  La página de confirmación solo se muestra si la API devuelve la orden en estado `paid`.

## 🔐 Seguridad

- **Token en cookie httpOnly** (`shop_token`), con `SameSite=Lax`, `Secure` en producción y expiración igual a la
  del token de Sanctum. JavaScript del navegador no puede leerlo (mitiga XSS).
- La URL de la API y el token **solo existen en el servidor** (`import "server-only"` en `lib/api.ts`, `lib/session.ts` y `lib/data.ts`).
- `proxy.ts` hace un **chequeo optimista**: redirige a `/login?next=…` si no hay cookie en rutas protegidas.
  La autorización real la hace la API en cada request; si responde `401`, se cierra la sesión y se pide login otra vez.
- Las Server Actions de Next.js validan el `Origin` (protección CSRF incluida).
- `?next=` solo acepta rutas internas (evita *open redirects*).
- Cabeceras `X-Content-Type-Options`, `X-Frame-Options: DENY` y `Referrer-Policy`.
- Logout revoca el token en Sanctum (`POST /auth/logout`) además de borrar las cookies.

## ⚡ Rendimiento y resiliencia

| Requisito | Implementación |
|---|---|
| `loading.tsx` en rutas clave | `app/(catalog)/loading.tsx`, `app/products/[id]/loading.tsx`, `app/checkout/loading.tsx`, `app/orders/loading.tsx` |
| `error.tsx` por segmento | Catálogo, detalle, checkout (y subrutas) e historial, con botón **Reintentar** (`retry()`) |
| `Suspense` en secciones pesadas | Listado de productos y filtros en `/`, listado de órdenes en `/orders`, detalle, pago y confirmación |
| Evitar UI desactualizada | `updateTag` / `revalidatePath` en todas las Server Actions (ver Arquitectura) |
| Partial Prerendering | Todas las páginas generan un **shell estático** que se sirve al instante; los datos se transmiten por streaming |
| Imágenes | `next/image` con `sizes` responsivos, AVIF/WebP, `fetchPriority="high"` en la imagen LCP y `lazy` para el resto |
| CLS ≈ 0 | Contenedores con `aspect-ratio`, skeletons con la misma altura que el contenido final (el *fallback* de filtros es el mismo formulario) |
| Fuentes | `next/font` (Geist auto-hospedada, sin saltos de layout) |
| JS mínimo | Filtros del catálogo con `<form method="get">` (funcionan sin JavaScript); solo carrito y formularios son Client Components |

### Reporte Lighthouse

Reportes completos (HTML y JSON) en [`docs/lighthouse/`](docs/lighthouse/). Medido con `next build && next start`,
Lighthouse 12, en local:

| Página | Dispositivo | Performance | Accesibilidad | Buenas prácticas | SEO | LCP | TBT | CLS |
|---|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Catálogo `/` | Escritorio | **100** | **100** | **100** | **100** | 0.8 s | 30 ms | 0 |
| Catálogo `/` | Móvil (4G lento + CPU 4×) | 81 | **100** | **100** | **100** | 3.2 s | 440 ms | 0 |
| Detalle `/products/1` | Móvil (4G lento + CPU 4×) | 79 | **100** | **100** | 91 | 3.1 s | 600 ms | 0.007 |

Notas:
- En móvil el LCP es la primera imagen de producto, que depende de la respuesta de la API (`php artisan serve`,
  un solo proceso) y de descargar la imagen remota de `placehold.co`. Con la API en un servidor de producción y
  las imágenes en un CDN, el LCP baja.
- SEO 91 en el detalle: la meta descripción del producto se genera con `generateMetadata` y Next.js la
  transmite por streaming a navegadores (a los bots de buscadores se la entrega bloqueante en el `<head>`).
- Para regenerar los reportes:

```bash
npm run build && npm run start
npx lighthouse http://localhost:3000/ --preset=desktop --output=html --output-path=./docs/lighthouse/catalogo-escritorio
npx lighthouse http://localhost:3000/ --output=html --output-path=./docs/lighthouse/catalogo-movil
```

## 🧪 Probar el flujo completo de compra

1. Abre `/`, filtra el catálogo y agrega productos al carrito.
2. En `/cart` ajusta cantidades y pulsa **Continuar al checkout**: sin sesión, `proxy.ts` te lleva a `/login?next=/checkout`.
3. Inicia sesión con `cliente@ecommerce.test` / `Cliente123!` y vuelves al checkout.
4. Escribe la dirección y pulsa **Crear orden**: la API calcula impuestos y total, y reserva stock.
5. En la pantalla de pago elige una tarjeta de prueba:

   | PaymentMethod | Resultado |
   |---|---|
   | `pm_card_visa` / `pm_card_mastercard` | Pago aprobado → `/checkout/{id}/success` |
   | `pm_card_chargeDeclined` | Rechazada: se muestra el error y la orden queda `failed` (se puede reintentar) |
   | `pm_card_chargeDeclinedInsufficientFunds` | Fondos insuficientes |

6. Revisa la orden en **Mis compras** (`/orders`), filtra por estado y abre el detalle.

> El pago necesita que la API tenga claves de Stripe **de prueba** válidas (`STRIPE_KEY` / `STRIPE_SECRET`).
> Si la API responde con un error de pasarela, el frontend muestra el mensaje y la orden sigue pendiente.

## 📁 Estructura del proyecto

```
app/
├── (catalog)/            # "/": catálogo (page, loading, error)
├── products/[id]/        # detalle de producto (page, loading, error)
├── cart/                 # carrito (estado local)
├── login/  register/     # autenticación
├── checkout/             # crear orden (page, loading, error)
│   └── [orderId]/        # pago con Stripe
│       └── success/      # confirmación de compra
├── orders/               # historial protegido (page, loading, error)
│   └── [id]/             # detalle de orden
├── actions/              # Server Actions: auth.ts, orders.ts
├── api/auth/logout/      # Route Handler de cierre de sesión
├── layout.tsx            # navbar con sesión en <Suspense>
└── not-found.tsx
components/               # UI (carrito, formularios, tarjetas, skeletons…)
lib/
├── api.ts                # cliente HTTP del servidor + ApiError
├── data.ts               # lecturas (use cache, cacheTag) y TAGS
├── session.ts            # cookies httpOnly
├── types.ts              # tipos de los Resources de la API
└── format.ts             # moneda y fechas (es-SV)
proxy.ts                  # protección optimista de rutas
docs/lighthouse/          # evidencia de rendimiento
```

## 📸 Evidencias para la entrega

- [x] Reportes Lighthouse: `docs/lighthouse/*.report.html`
- [ ] Capturas de los endpoints consumidos en Swagger (`http://localhost:8000/api/documentation`)
- [ ] Capturas del flujo completo de compra (catálogo → carrito → login → orden → pago → confirmación → historial)
