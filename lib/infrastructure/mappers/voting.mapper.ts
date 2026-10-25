import { translateError } from "@/lib/infrastructure/api-client";

export function mapDeliveryStatus(code: string): string {
  return translateError(code);
}
