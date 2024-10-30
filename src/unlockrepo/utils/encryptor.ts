import { AES, enc } from "crypto-js";
import { env } from "@/config/env";

function encrypt(
  plainText: string,
  encryptionKey: string = env.TOKEN_ENCRYPTION_KEY
) {
  return AES.encrypt(plainText, encryptionKey).toString();
}

function decrypt(
  encryptedText: string,
  encryptionKey: string = env.TOKEN_ENCRYPTION_KEY
) {
  return AES.decrypt(encryptedText, encryptionKey).toString(enc.Utf8);
}

function encryptJSON(obj: any) {
  return encrypt(JSON.stringify(obj));
}

function decryptJSON<T extends Record<string, unknown>>(
  encryptedJSON: string
): T {
  return JSON.parse(decrypt(encryptedJSON));
}

export const Encryptor = {
  encrypt,
  decrypt,
  encryptJSON,
  decryptJSON,
};
