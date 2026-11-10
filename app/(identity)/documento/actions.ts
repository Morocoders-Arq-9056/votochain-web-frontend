"use server";

import { cookies } from "next/headers";
import { createDocumentService } from "@/lib/application/submit-document";
import { identityPort } from "@/lib/infrastructure/api/composition";

async function personId(): Promise<string> {
  return (await cookies()).get("personId")?.value ?? "";
}

export async function submitDocument(input: {
  documentType: string;
  consent: boolean;
}) {
  return createDocumentService(identityPort()).upload({
    personId: await personId(),
    upload: {
      documentType: input.documentType,
      frontName: "anverso.jpg",
      backName: "reverso.jpg",
      selfieName: "rostro.jpg",
      acceptedPolicyVersion: input.consent ? "v1" : "",
    },
  });
}
