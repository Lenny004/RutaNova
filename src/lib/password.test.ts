import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "@/lib/password";

describe("password", () => {
  it("hashea y verifica una contraseña correcta", async () => {
    const password = "RutaNova2024!";
    const hash = await hashPassword(password);

    expect(hash).not.toBe(password);
    expect(hash.startsWith("$2")).toBe(true);
    expect(await verifyPassword(password, hash)).toBe(true);
  });

  it("rechaza una contraseña incorrecta", async () => {
    const hash = await hashPassword("clave-segura");

    expect(await verifyPassword("clave-incorrecta", hash)).toBe(false);
  });

  it("genera hashes distintos para la misma contraseña", async () => {
    const password = "misma-clave";
    const hashA = await hashPassword(password);
    const hashB = await hashPassword(password);

    expect(hashA).not.toBe(hashB);
    expect(await verifyPassword(password, hashA)).toBe(true);
    expect(await verifyPassword(password, hashB)).toBe(true);
  });
});
