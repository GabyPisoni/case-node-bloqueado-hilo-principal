import { Controller, Get, Query } from '@nestjs/common';

@Controller()
export class BlockingController {

  private requestCount = 0;
  private startTime = Date.now();

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
    //Por trozos
    const chunkSize = 10000;
    const totalChucnks = Math.ceil(iterations / chunkSize);
    let totalResult = 0;
    let chunk;
    // Este for es el que divide cuantos chunks se haran y el segundo se encarga del rango
    for (chunk = 0; chunk < totalChucnks; chunk++) {
      const startIndex = chunk * chunkSize;
      const endIndex = Math.min(startIndex + chunkSize, iterations);
      //Este for se encarga del por cada iteracion del primero del rango de cada chunk
      for (let i = startIndex; i < endIndex; i++) {
        //En esta logica haria lo que tiene que hacer por parter
        totalResult += Math.sqrt(i) * Math.sin(i) * Math.cos(i);
      }
      //La asincronia pausa para que el thread principal no se bloquee y pueda hacer otra operacion
      await new Promise(resolve => setTimeout(resolve, 0));
    }
    return totalResult;
  }

  private calculateFibonacci(n: number): number {
    if (n <= 1) return n;
    return this.calculateFibonacci(n - 1) + this.calculateFibonacci(n - 2);
  }
}
