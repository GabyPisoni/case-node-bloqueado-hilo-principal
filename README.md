# 🚨 Desafío: Bloqueo del Thread Principal en Node.js

## 📋 Descripción del Problema

Este proyecto demuestra un problema común en aplicaciones Node.js: **el bloqueo del thread principal**. Cuando ejecutas operaciones intensivas de CPU, el servidor se vuelve no responsivo y no puede manejar otras peticiones hasta que termine la operación.

### 🎯 Objetivo del Desafío
Tu misión es **resolver el bloqueo** para mantener el servidor responsivo mientras se ejecutan operaciones pesadas.

---

## 🚀 Configuración Inicial

### Instalación
```bash
npm install
```

### Ejecutar el proyecto
```bash
npm run start:dev
```

El servidor se ejecutará en `http://localhost:3000`

---

## 🧪 Demostración del Problema

### Endpoints Disponibles

| Endpoint | Descripción | Parámetros |
|----------|-------------|------------|
| `GET /status` | Verifica que el servidor funciona | Ninguno |
| `GET /blocking` | **Operación que bloquea el thread** | `iterations` (default: 10000000) |
| `GET /fibonacci` | **Fibonacci recursivo que bloquea** | `n` (default: 40) |

### 🔍 Cómo Probar el Bloqueo

1. **Inicia el servidor:**
   ```bash
   npm run start:dev
   ```

2. **Abre 3 pestañas diferentes en tu terminal:**

   **Pestaña 1 - Verificar funcionamiento:**
   ```bash
   curl http://localhost:3000/status
   # Debería responder inmediatamente
   ```

   **Pestaña 2 - Ejecutar operación bloqueante:**
   ```bash
   curl http://localhost:3000/blocking?iterations=50000000
   # Esto bloqueará el servidor por varios segundos
   ```

   **Pestaña 3 - Intentar acceder durante el bloqueo:**
   ```bash
   curl http://localhost:3000/status
   # ¡NO RESPONDERÁ hasta que termine la operación bloqueante!
   ```

3. **Observa el comportamiento:**
   - ✅ La primera petición responde inmediatamente
   - 🚨 La segunda petición bloquea todo el servidor
   - ❌ La tercera petición se queda "colgada" esperando

### 📡 cURLs para Postman

#### **1. Verificar Estado del Servidor**
```bash
curl -X GET "http://localhost:3000/status" \
  -H "Content-Type: application/json"
```

#### **2. Operación Bloqueante (Diferentes Intensidades)**

**Operación Ligera (rápida):**
```bash
curl -X GET "http://localhost:3000/blocking?iterations=1000000" \
  -H "Content-Type: application/json"
```

**Operación Media (bloquea por 2-3 segundos):**
```bash
curl -X GET "http://localhost:3000/blocking?iterations=10000000" \
  -H "Content-Type: application/json"
```

**Operación Pesada (bloquea por 5-10 segundos):**
```bash
curl -X GET "http://localhost:3000/blocking?iterations=50000000" \
  -H "Content-Type: application/json"
```

**Operación Muy Pesada (bloquea por 15+ segundos):**
```bash
curl -X GET "http://localhost:3000/blocking?iterations=100000000" \
  -H "Content-Type: application/json"
```

#### **3. Fibonacci Bloqueante**

**Fibonacci Pequeño (rápido):**
```bash
curl -X GET "http://localhost:3000/fibonacci?n=30" \
  -H "Content-Type: application/json"
```

**Fibonacci Mediano (bloquea por 3-5 segundos):**
```bash
curl -X GET "http://localhost:3000/fibonacci?n=40" \
  -H "Content-Type: application/json"
```

**Fibonacci Grande (bloquea por 10+ segundos):**
```bash
curl -X GET "http://localhost:3000/fibonacci?n=45" \
  -H "Content-Type: application/json"
```

### 🧪 Prueba de Bloqueo con Postman

1. **Importa estas cURLs a Postman**
2. **Ejecuta `/status`** - Debe responder inmediatamente
3. **Ejecuta `/blocking?iterations=50000000`** - Bloqueará el servidor
4. **Mientras está ejecutándose, intenta `/status`** - No responderá hasta que termine
5. **Una vez terminado, `/status`** - Volverá a responder normalmente

### 📊 Respuestas Esperadas

#### **Status Response:**
```json
{
  "message": "Servidor funcionando correctamente",
  "uptime": 12345,
  "requests": 5,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### **Blocking Response:**
```json
{
  "message": "Operación bloqueante completada",
  "result": 123456.789,
  "duration": "3247ms",
  "iterations": 50000000,
  "timestamp": "2024-01-15T10:30:03.247Z"
}
```

#### **Fibonacci Response:**
```json
{
  "message": "Cálculo de Fibonacci completado",
  "n": 40,
  "result": 102334155,
  "duration": "4123ms",
  "timestamp": "2024-01-15T10:30:04.123Z"
}
```

---

## 🎯 Tu Desafío: Implementar Solución

### ❌ Problema Actual
```typescript
// En blocking.controller.ts - Líneas 25-40
@Get('blocking')
blockingOperation(@Query('iterations') iterations: string = '10000000') {
  // Esta operación bloquea el thread principal
  const result = this.heavyComputation(parseInt(iterations));
  return { result, duration: '...' };
}
```

### ✅ Lo que debes lograr
- El servidor debe seguir respondiendo a `/status` mientras se ejecuta `/blocking`
- Las operaciones pesadas deben ejecutarse sin bloquear el thread principal
- Mantener la funcionalidad pero con mejor rendimiento

---

## 🧪 Script de Prueba

Incluí un script para automatizar las pruebas:

```bash
node test-script.js
```

Este script:
1. Verifica que el servidor funciona
2. Ejecuta una operación bloqueante
3. Intenta acceder al status durante el bloqueo
4. Reporta si el servidor está responsivo

---

## 🎯 Criterios de Éxito

Tu solución será exitosa si:

✅ **El servidor responde a `/status` mientras se ejecuta `/blocking`**
✅ **Las operaciones pesadas se completan correctamente**
✅ **No hay errores en la consola**
✅ **El rendimiento general mejora**

---

## 🚀 ¡Comienza el Desafío!

1. **Instala las dependencias:** `npm install`
2. **Ejecuta el servidor:** `npm run start:dev`
3. **Prueba el bloqueo** con el script de prueba
4. **Investiga y encuentra tu propia solución** para resolver el problema
5. **Implementa tu solución** en `blocking.controller.ts`
6. **Verifica que funciona** con las pruebas

### 🎉 ¡Buena suerte resolviendo el desafío!

**Recuerda:** El objetivo es mantener el servidor responsivo mientras se ejecutan operaciones pesadas. ¡Encuentra tu propia manera de resolverlo!
