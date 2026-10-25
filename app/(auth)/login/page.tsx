import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-surface px-6 pt-10">
      <Badge tone="success">Tu voto ya cuenta</Badge>
      <h1 className="mt-4 font-display text-2xl text-text-primary">
        Inicie sesión
      </h1>
      <div className="mt-6 flex flex-col gap-4">
        <Button type="button">Continuar</Button>
      </div>
      <nav aria-label="Principal" className="bottom-bar mt-auto flex items-center">
        <span className="text-sm text-text-secondary">VotaChain</span>
      </nav>
    </main>
  );
}
