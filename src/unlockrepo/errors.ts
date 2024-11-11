import type { ZodError, ZodIssue } from "zod";

export class AppError extends Error {}

export class HTTPError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

export class ParsingError<T> extends Error {
  constructor(message: string, public error: ZodError<T>) {
    super(message);
  }

  formatErrors() {
    return this.error.errors.map((issue: ZodIssue) => ({
      message: issue.message,
    }));
  }
}
