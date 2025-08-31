import { Injectable } from '@nestjs/common';
import { Worker } from 'worker_threads';
import { IWorkerService } from './IWorkerServie';
import * as path from 'path';

@Injectable()
export class WorkerService implements IWorkerService{
  async processEvent(event: any) {
    // Si es HEAVY_COMPUTATION, usar worker thread real
    if (event.type === 'HEAVY_COMPUTATION') {
      return await this.executeHeavyComputationWithWorker(event.iterations);
    }
    
    // Para otros tipos, usar worker
    const worker = new Worker('./worker.ts');
    worker.postMessage(event);

    return new Promise((resolve, reject) => {
      worker.on('message', (result) => {
        resolve(result);
      });
      worker.on('error', (error) => {
        reject(error);
      });
    });
  }

  // Usa worker thread real para no bloquear el thread principal
  private async executeHeavyComputationWithWorker(iterations: number): Promise<any> {
    return new Promise((resolve, reject) => {
      // Crear un worker que ejecute la lógica pesada
      const worker = new Worker(`
        const { parentPort } = require('worker_threads');
        
        parentPort.on('message', (data) => {
          const iterations = data.iterations;
          let result = 0;
          
          console.log('🔄 Worker iniciando computación con', iterations, 'iteraciones');
          
          // Operación intensiva que NO bloquea el thread principal
          for (let i = 0; i < iterations; i++) {
            result += Math.sqrt(i) * Math.sin(i) * Math.cos(i);
            
            // Cada 1000000 iteraciones, hacer una operación adicional para aumentar la carga
            if (i % 1000000 === 0) {
              console.log('📊 Progreso:', i, 'de', iterations, 'iteraciones');
              for (let j = 0; j < 1000; j++) {
                result += Math.pow(j, 2);
              }
            }
          }
          
          console.log('✅ Worker completó la computación');
          parentPort.postMessage(result);
        });
      `, { eval: true, stdout: true, stderr: true });

      // Enviar los datos al worker
      worker.postMessage({ iterations });

      // Escuchar el resultado
      worker.on('message', (result) => {
        console.log('📨 Worker envió resultado:', result);
        worker.terminate();
        resolve(result);
      });

      worker.on('error', (error) => {
        console.error('❌ Error en worker:', error);
        worker.terminate();
        reject(error);
      });

      worker.on('exit', (code) => {
        if (code !== 0) {
          console.error('🚪 Worker terminó con código:', code);
          reject(new Error(`Worker terminó con código: ${code}`));
        }
      });

      // Escuchar stdout del worker
      worker.stdout?.on('data', (data) => {
        console.log('🔧 Worker stdout:', data.toString());
      });

      // Escuchar stderr del worker
      worker.stderr?.on('data', (data) => {
        console.error('🔧 Worker stderr:', data.toString());
      });
    });
  }
}
