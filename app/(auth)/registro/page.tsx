import { Button } from "@/components/atoms/Button";

export default function RegisterPage() {
  return (
    <main className="mx-auto w-full max-w-md bg-surface px-6 pt-10">
      <h1 className="font-display text-2xl text-text-primary">Cree su cuenta</h1>
      <div className="mt-6">
        <Button type="button">Crear cuenta</Button>
      </div>
    </main>
  );
}
