import { Logger } from '@nestjs/common';

export function Measure(): MethodDecorator {
  return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const logger = new Logger(target.constructor.name);
      const start = Date.now();
      const result = await originalMethod.apply(this, args);
      const end = Date.now();
      const executionTime = end - start;

      if (executionTime < 1000) {
        logger.log(`[EXEC TIME] ${String(propertyKey)}: ${executionTime} ms`);
      } else {
        const isUrl = (str: string): boolean => {
          try {
            new URL(str);
            return true;
          } catch {
            return false;
          }
        };

        const firstArg = args.length > 0 ? args[0] : null;
        const url = typeof firstArg === 'string' && isUrl(firstArg) ? firstArg : '';
        const warnMessage = url
          ? `[EXEC TIME] ${String(propertyKey)}: ${executionTime} ms, ${url}`
          : `[EXEC TIME] ${String(propertyKey)}: ${executionTime} ms`;
        logger.warn(warnMessage);
      }

      return result;
    };

    return descriptor;
  };
}
