import { Badge } from "@/components/atoms";

export default function ReciboPage() {
  return (
    <main className="mx-auto w-full max-w-md px-6 pt-10">
      <h1 className="font-display text-2xl">Recibo de voto</h1>
      <ol aria-live="polite" className="mt-4">
        <li>
          <Badge tone="success">Confirmado — ya cuenta</Badge>
        </li>
      </ol>
    </main>
  );
}
