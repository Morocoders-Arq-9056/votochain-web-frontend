import { Badge, Button } from "@/components/atoms";
import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-surface px-6 pt-10">
      <Badge tone="success">Tu voto ya cuenta</Badge>
      <h1 className="mt-4 font-display text-2xl text-text-primary">VotaChain</h1>
      <p className="mt-2 text-base text-text-secondary">
        Solo los votos confirmados cuentan en el escrutinio.
      </p>
      <div className="mt-6 flex flex-col gap-4">
        <Link href="/login">
          <Button type="button">Iniciar sesión</Button>
        </Link>
      </div>
    </main>
  );
}
