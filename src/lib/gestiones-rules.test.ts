import { describe, expect, it } from "vitest";
import {
  puedeCancelar,
  puedeIniciar,
  progresoAlIniciar,
} from "@/lib/gestiones-rules";
import { PROGRESO_MINIMO_INICIO } from "@/lib/gestiones";

describe("gestiones-rules", () => {
  describe("puedeIniciar", () => {
    it("permite iniciar solo gestiones pendientes", () => {
      expect(puedeIniciar("PENDIENTE")).toBe(true);
      expect(puedeIniciar("EN_CURSO")).toBe(false);
      expect(puedeIniciar("COMPLETADA")).toBe(false);
      expect(puedeIniciar("CANCELADA")).toBe(false);
    });
  });

  describe("puedeCancelar", () => {
    it("permite cancelar gestiones pendientes o en curso", () => {
      expect(puedeCancelar("PENDIENTE")).toBe(true);
      expect(puedeCancelar("EN_CURSO")).toBe(true);
      expect(puedeCancelar("COMPLETADA")).toBe(false);
      expect(puedeCancelar("CANCELADA")).toBe(false);
    });
  });

  describe("progresoAlIniciar", () => {
    it("eleva el progreso al mínimo de inicio cuando es menor", () => {
      expect(progresoAlIniciar(15)).toBe(PROGRESO_MINIMO_INICIO);
      expect(progresoAlIniciar(0)).toBe(PROGRESO_MINIMO_INICIO);
    });

    it("conserva el progreso si ya supera el mínimo", () => {
      expect(progresoAlIniciar(55)).toBe(55);
      expect(progresoAlIniciar(PROGRESO_MINIMO_INICIO)).toBe(
        PROGRESO_MINIMO_INICIO,
      );
    });
  });
});
