import { Controller, Get, Query, Inject } from '@nestjs/common';
import { WorkerService } from './utils/thread-worker';
import { IWorkerService } from './utils/IWorkerServie';

@Controller()
export class BlockingController {

  private requestCount = 0;
  private startTime = Date.now();
  
  constructor(
    @Inject(IWorkerService) private readonly threadWorkerService: IWorkerService
  ) {}

  @Get('status')
  getStatus() {
    return {
      message: 'Servidor funcionando correctamente',
      uptime: Date.now() - this.startTime,
      requests: this.requestCount,
      timestamp: new Date().toISOString()
    };
  }

  @Get('blocking')
 async blockingOperation(@Query('iterations') iterations: string = '10000000') {
    this.requestCount++;
    const startTime = Date.now();

    console.log(`🚨 Iniciando operación bloqueante con ${iterations} iteraciones...`);

    // Esta operación bloqueará el thread principal
    const result = await this.heavyComputation(parseInt(iterations));

    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log(`✅ Operación completada en ${duration}ms`);

    return {
      message: 'Operación bloqueante completada',
      result: result,
      duration: `${duration}ms`,
      iterations: parseInt(iterations),
      timestamp: new Date().toISOString()
    };
  }

  @Get('fibonacci')
  fibonacciBlocking(@Query('n') n: string = '40') {
    this.requestCount++;
    const startTime = Date.now();

    console.log(`🚨 Calculando Fibonacci(${n}) de forma bloqueante...`);

    const result = this.calculateFibonacci(parseInt(n));

    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log(`✅ Fibonacci(${n}) = ${result} completado en ${duration}ms`);

    return {
      message: 'Cálculo de Fibonacci completado',
      n: parseInt(n),
      result: result,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString()
    };
  }

 private async heavyComputation(iterations: number): Promise<any> {
    console.log(`🔧 heavyComputation: Delegando al WorkerService con ${iterations} iteraciones`);
    console.log(`⏰ Thread principal sigue libre: ${new Date().toISOString()}`);
    
    // Usar el worker service internamente
    const result = await this.threadWorkerService.processEvent({
      type: 'HEAVY_COMPUTATION',
      iterations: iterations
    });
    
    console.log(`🔧 heavyComputation: WorkerService completó, resultado recibido`);
    return result;
  }

  private calculateFibonacci(n: number): number {
    if (n <= 1) return n;
    return this.calculateFibonacci(n - 1) + this.calculateFibonacci(n - 2);
  }
}
