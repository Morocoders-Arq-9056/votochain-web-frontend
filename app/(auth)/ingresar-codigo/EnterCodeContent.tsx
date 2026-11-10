import { EnterCodeFlow } from "./EnterCodeFlow";

export async function EnterCodeContent({
  searchParams,
}: {
  searchParams: Promise<{ purpose?: string; email?: string }>;
}) {
  const { purpose, email } = await searchParams;
  return (
    <EnterCodeFlow
      purpose={purpose === "recovery" ? "recovery" : "vote"}
      email={email}
    />
  );
}
