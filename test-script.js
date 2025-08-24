const http = require('http');

const BASE_URL = 'http://localhost:3000';

// Función para hacer peticiones HTTP
function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const req = http.get(`${BASE_URL}${path}`, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve(result);
        } catch (e) {
          resolve(data);
        }
      });
    });
    
    req.on('error', (err) => {
      reject(err);
    });
    
    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
  });
}

// Función para simular múltiples peticiones
async function testBlocking() {
  console.log('🧪 Iniciando prueba de bloqueo...\n');
  
  try {
    // 1. Verificar que el servidor funciona
    console.log('1️⃣ Verificando estado del servidor...');
    const status1 = await makeRequest('/status');
    console.log('✅ Servidor respondió:', status1.message);
    
    // 2. Iniciar operación bloqueante
    console.log('\n2️⃣ Iniciando operación bloqueante...');
    const blockingPromise = makeRequest('/blocking?iterations=20000000');
    
    // 3. Intentar hacer otra petición mientras está bloqueado
    console.log('3️⃣ Intentando acceder al status mientras está bloqueado...');
    
    setTimeout(async () => {
      try {
        const status2 = await makeRequest('/status');
        console.log('✅ Status respondió durante bloqueo:', status2.message);
      } catch (error) {
        console.log('❌ Status NO respondió durante bloqueo:', error.message);
      }
    }, 1000);
    
    // 4. Esperar a que termine la operación bloqueante
    const blockingResult = await blockingPromise;
    console.log('✅ Operación bloqueante completada:', blockingResult.duration);
    
    // 5. Verificar que el servidor vuelve a responder
    console.log('\n4️⃣ Verificando que el servidor vuelve a responder...');
    const status3 = await makeRequest('/status');
    console.log('✅ Servidor responde nuevamente:', status3.message);
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error.message);
  }
}

// Ejecutar la prueba
testBlocking();
