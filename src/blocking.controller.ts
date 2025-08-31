import { Controller, Get, Query , Logger} from '@nestjs/common';

@Controller()
export class BlockingController {

  private requestCount = 0;
  private startTime = Date.now();
private loggerNestJs = new Logger()
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

  private heavyComputation(iterations: number): Promise<number> {
    let result = 0;
   
    return new Promise((resolve) => {
      const operationHigh = (startIndex) => {
        for (let i = 0; i < startIndex; i++) {
          result += Math.sqrt(i) * Math.sin(i) * Math.cos(i);
          this.loggerNestJs.log("Haciendo Operacion NRO :", i)
          // Cada 1000000 iteraciones, hacer una operación adicional para aumentar la carga
          if (i % 1000000 === 0) {
            for (let j = 0; j < 1000; j++) {
              this.loggerNestJs.log("Haciendo DE CARGA :", j);
              result += Math.pow(j, 2);
            }
          }
        }
 
        const nextStartIndex = startIndex + 10000;
       
        if (nextStartIndex <= iterations) {
          // Continuar con el siguiente chunk
          setTimeout(() => operationHigh(nextStartIndex), 1000);
        } else {
          //startIndex superó iterations
          console.log("Procesamiento completado");
          resolve(result); // Resolver la promesa con el resultado
        }
      };
     
      operationHigh(0); // Iniciar el procesamiento
    });
  }
 


  private calculateFibonacci(n: number): number {
    if (n <= 1) return n;
    return this.calculateFibonacci(n - 1) + this.calculateFibonacci(n - 2);
  }
}
