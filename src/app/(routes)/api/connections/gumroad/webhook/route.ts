import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAppServices, type Services } from "@/unlockrepo/app_services";
import { Encryptor } from "@/unlockrepo/utils/encryptor";
import { HTTPError, ParsingError } from "@/unlockrepo/errors";
import { createErrorResponse } from "@/app/_libs/response";

export const POST = async (request: NextRequest) => {
  const services = createAppServices();

  try {
    await handleRequest(request, services);

    return NextResponse.json({}, { status: 200 });
  } catch (error: unknown) {
    return createErrorResponse(
      error,
      services.logger.child({ scope: request.nextUrl.pathname })
    );
  }
};

async function handleRequest(request: NextRequest, services: Services) {
  const searchParams = request.nextUrl.searchParams;
  const verificationParam = searchParams.get("verification");

  const verification = verifyToken(verificationParam);

  if (!verification) {
    throw new HTTPError("Missing or invalid verification token", 401);
  }

  const formData = await request.formData();
  const parseResult = safeParseRequest({
    verification,
    resourceName: formData.get("resource_name"),
    githubUsername: formData.get("custom_fields[Github Username]"),
  });

  if (!parseResult.success) {
    throw new ParsingError("Malformed request schema", parseResult.error);
  }

  const { data } = parseResult;

  await services.merchant.processWebhook({
    unlockId: data.verification.unlockId,
    githubUsername: data.githubUsername,
    name: data.resourceName,
  });
}

function verifyToken(verification: string | null) {
  if (!verification) return null;

  try {
    return Encryptor.decryptJSON(verification);
  } catch {
    return null;
  }
}

function safeParseRequest(data: unknown) {
  return z
    .object({
      resourceName: z.union([z.literal("sale"), z.literal("refund")]),
      githubUsername: z.string().min(1, { message: "Missing Github Username" }),
      verification: z.object({
        unlockId: z.string().uuid(),
      }),
    })
    .safeParse(data);
}
