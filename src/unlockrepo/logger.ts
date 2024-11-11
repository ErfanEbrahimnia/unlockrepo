import pino from "pino";
import pinoPretty from "pino-pretty";
import { isDev, isProduction } from "@/config/env";

export interface Logger {
  child({ scope }: { scope: string }): Logger;

  info(message: string, params?: object): void;

  debug(message: string, params?: object): void;

  warn(message: string, params?: object): void;

  error(message: string, params?: object): void;
}

export function createLogger(): Logger {
  const pinoStream = isDev()
    ? pinoPretty({
        colorize: true,
      })
    : undefined;

  return pino(
    {
      level: isProduction() ? "error" : "debug",
      hooks: {
        logMethod(inputArgs, method) {
          if (inputArgs.length >= 2) {
            const arg1 = inputArgs.shift();
            const arg2 = inputArgs.shift();
            return method.apply(this, [arg2, arg1, ...inputArgs]);
          }
          return method.apply(this, inputArgs);
        },
      },
    },
    pinoStream
  );
}
