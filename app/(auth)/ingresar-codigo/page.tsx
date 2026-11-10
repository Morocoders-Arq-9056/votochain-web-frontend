import { Suspense } from "react";
import { EnterCodeContent } from "./EnterCodeContent";
import { ENTER_CODE_LOADING } from "@/lib/ui/copy";

export default function EnterCodePage({
  searchParams,
}: {
  searchParams: Promise<{ purpose?: string; email?: string }>;
}) {
  return (
    <Suspense
      fallback={
        <p className="text-base text-text-secondary">{ENTER_CODE_LOADING}</p>
      }
    >
      <EnterCodeContent searchParams={searchParams} />
    </Suspense>
  );
}
