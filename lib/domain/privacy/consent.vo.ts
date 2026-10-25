import { z } from "zod";

export const ConsentRecordSchema = z.object({
  finalidad: z.enum(["biometria", "contacto", "documental"]),
  estado: z.enum(["PERMITIDO", "RETIRADO"]),
  versionPolitica: z.string().min(1),
});

export type ConsentRecord = z.infer<typeof ConsentRecordSchema>;

export function requiresContactBlock(consents: ConsentRecord[]): boolean {
  const parsed = z.array(ConsentRecordSchema).parse(consents);
  const contacto = parsed.find((c) => c.finalidad === "contacto");
  return contacto?.estado === "RETIRADO";
}
