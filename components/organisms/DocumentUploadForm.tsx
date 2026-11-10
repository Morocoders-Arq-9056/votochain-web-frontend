"use client";

import { useState } from "react";
import { Button } from "@/components/atoms/Button";
import { ConsentCheckbox } from "@/components/atoms/ConsentCheckbox";
import { Select } from "@/components/atoms/Select";
import { Notice } from "@/components/molecules/Notice";
import type { DocumentType } from "@/lib/domain/identity/document.vo";
import {
  DOCUMENT_BACK_TITLE,
  DOCUMENT_CONSENT,
  DOCUMENT_FRONT_TITLE,
  DOCUMENT_NOTICE_DETAIL,
  DOCUMENT_NOTICE_TITLE,
  DOCUMENT_SELFIE_TITLE,
  DOCUMENT_SUBMIT,
  DOCUMENT_TYPE_LABEL,
  DOCUMENT_UPLOAD,
} from "@/lib/ui/copy";

type DocumentUploadFormProps = {
  pending?: boolean;
  serverError?: string | null;
  onSubmit: (input: {
    documentType: DocumentType;
    consent: boolean;
  }) => void;
};

function FileSlot({ title, onPick }: { title: string; onPick: () => void }) {
  const [name, setName] = useState<string | null>(null);
  return (
    <div className="flex w-full flex-col gap-2 rounded-card border border-border bg-surface p-5 shadow-card">
      <h3 className="text-base font-semibold text-text-primary">{title}</h3>
      <p className="text-sm text-text-secondary">{name ?? "Sin archivo"}</p>
      <Button
        type="button"
        variant="secondary"
        onClick={() => {
          setName("foto.jpg · 1.2 MB");
          onPick();
        }}
      >
        {DOCUMENT_UPLOAD}
      </Button>
    </div>
  );
}

export function DocumentUploadForm({ pending, serverError, onSubmit }: DocumentUploadFormProps) {
  const [documentType, setDocumentType] = useState<DocumentType>("DNI");
  const [picked, setPicked] = useState(0);
  const [consent, setConsent] = useState(false);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ documentType, consent });
      }}
      className="flex w-full flex-col gap-[var(--spacing-form-gap)]"
      noValidate
    >
      <Notice tone="info" title={DOCUMENT_NOTICE_TITLE} detail={DOCUMENT_NOTICE_DETAIL} />
      <Select
        id="document-type"
        label={DOCUMENT_TYPE_LABEL}
        value={documentType}
        onChange={(e) => setDocumentType(e.target.value as DocumentType)}
      >
        <option value="DNI">DNI</option>
        <option value="CE">Carné de extranjería</option>
        <option value="PASSPORT">Pasaporte</option>
      </Select>
      <div className="grid w-full grid-cols-1 gap-[var(--spacing-form-gap)] md:grid-cols-2 xl:grid-cols-3">
        <FileSlot title={DOCUMENT_FRONT_TITLE} onPick={() => setPicked((p) => p + 1)} />
        <FileSlot title={DOCUMENT_BACK_TITLE} onPick={() => setPicked((p) => p + 1)} />
        <FileSlot title={DOCUMENT_SELFIE_TITLE} onPick={() => setPicked((p) => p + 1)} />
      </div>
      <ConsentCheckbox
        id="document-consent"
        checked={consent}
        description={DOCUMENT_CONSENT}
        onChange={setConsent}
      />
      {serverError && (
        <p role="alert" className="text-sm text-danger">
          {serverError}
        </p>
      )}
      <Button type="submit" loading={pending} disabled={picked < 0}>
        {DOCUMENT_SUBMIT}
      </Button>
    </form>
  );
}
