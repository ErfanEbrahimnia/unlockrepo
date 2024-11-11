import { NextResponse } from "next/server";
import { AppError, HTTPError, ParsingError } from "@/unlockrepo/errors";
import type { Logger } from "@/unlockrepo/logger";

export function createErrorResponse(error: unknown, logger: Logger) {
  if (error instanceof AppError) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  if (error instanceof HTTPError) {
    return NextResponse.json(
      { message: error.message },
      { status: error.status }
    );
  }

  if (error instanceof ParsingError) {
    return NextResponse.json(
      { message: error.message, details: error.formatErrors() },
      { status: 400 }
    );
  }

  if (error instanceof Error) {
    logger.error(error.message);
  }

  return NextResponse.json({ message: "Server Error" }, { status: 500 });
}
