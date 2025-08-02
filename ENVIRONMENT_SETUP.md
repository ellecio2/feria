# Configuración de Variables de Entorno

## Archivos de Configuración

### 1. Archivos de Environment de Angular

- `src/environments/environment.ts` - Configuración para desarrollo
- `src/environments/environment.prod.ts` - Configuración para producción

### 2. Archivos .env (Opcionales)

- `.env` - Variables de entorno principales
- `.env.development` - Variables específicas para desarrollo
- `.env.production` - Variables específicas para producción
- `.env.example` - Plantilla de ejemplo

## Variables Disponibles

### API_URL
- **Desarrollo**: `http://localhost:3321`
- **Producción**: `https://api.feriavehiculos.com`
- **Descripción**: URL base del backend API

### APP_NAME
- **Valor**: `Feria de Vehículos`
- **Descripción**: Nombre de la aplicación

### PRODUCTION
- **Desarrollo**: `false`
- **Producción**: `true`
- **Descripción**: Indica si la app está en modo producción

## Configuración del Backend Local

Para conectar con tu backend local que está corriendo en `http://localhost:3321`:

1. **Verificar environment.ts**:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3321',
  appName: 'Feria de Vehículos'
};
```

2. **Interceptor configurado**: El proyecto tiene un interceptor (`ApiInterceptor`) que automáticamente agrega la URL base a todas las peticiones que empiecen con `/api/`.

3. **Servicios**: Los servicios como `VehiclesService` usan endpoints relativos (ej: `/api/vehicles`) que se convierten automáticamente en `http://localhost:3321/api/vehicles`.

## Uso en los Servicios

Los servicios pueden usar endpoints relativos:

```typescript
// En lugar de: 'http://localhost:3321/api/vehicles'
// Usar: '/api/vehicles'
private endpoint = '/api/vehicles';
```

El interceptor se encarga de agregar la URL base automáticamente.

## Comandos para Desarrollo

```bash
# Ejecutar en modo desarrollo (usa environment.ts)
ng serve

# Ejecutar en modo producción (usa environment.prod.ts)
ng serve --configuration production
```

## Verificación

Para verificar que la configuración funciona correctamente:

1. Asegúrate de que tu backend esté corriendo en `http://localhost:3321`
2. Ejecuta `ng serve`
3. Abre las herramientas de desarrollador del navegador
4. Ve a la pestaña Network/Red
5. Realiza una acción que haga una petición HTTP
6. Verifica que las peticiones se estén enviando a `http://localhost:3321/api/...`
