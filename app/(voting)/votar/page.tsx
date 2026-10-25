import { Badge, Button } from "@/components/atoms";

export default function VotePage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-surface px-6 pt-10">
      <Badge tone="warning">En cola de envío</Badge>
      <h1 className="mt-4 font-display text-2xl text-text-primary">
        Emita su voto
      </h1>
      <div className="mt-6">
        <Button type="button">Firmar y votar</Button>
      </div>
      <nav aria-label="Principal" className="bottom-bar mt-auto flex items-center">
        <span className="text-sm text-text-secondary">VotaChain</span>
      </nav>
    </main>
  );
}
