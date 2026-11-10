"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IdentityTemplate } from "@/components/templates/IdentityTemplate";
import { DocumentUploadForm } from "@/components/organisms/DocumentUploadForm";
import { submitDocument } from "./actions";
import { identityNav } from "@/components/organisms/identityNav";
import {
  DOCUMENT_DESCRIPTION,
  DOCUMENT_TITLE,
  DOCUMENT_VALIDATION_ERROR,
} from "@/lib/ui/copy";
import { routes } from "@/lib/ui/routes";

export function DocumentFlow() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <IdentityTemplate
      title={DOCUMENT_TITLE}
      description={DOCUMENT_DESCRIPTION}
      nav={identityNav("identity")}
    >
      <div className="rounded-lg border border-border bg-surface p-5">
        <DocumentUploadForm
          pending={pending}
          serverError={error}
          onSubmit={async (input) => {
            setPending(true);
            setError(null);
            try {
              await submitDocument({
                documentType: input.documentType,
                consent: input.consent,
              });
              router.push(routes.documentoResultado());
            } catch {
              setError(DOCUMENT_VALIDATION_ERROR);
            } finally {
              setPending(false);
            }
          }}
        />
      </div>
    </IdentityTemplate>
  );
}
