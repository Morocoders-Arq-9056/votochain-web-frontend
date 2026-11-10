import { z } from "zod";

/**
 * Backend `UserResource` (IAM, `POST /auth/sign-in|sign-up`): the server
 * resolves the contact address into the technical identity, so callers
 * never present a user id they cannot know. Session is server-side state;
 * the frontend cookie only carries `userId`.
 */
export const UserResourceSchema = z.object({
  userId: z.string().min(1),
  personId: z.string().min(1),
  email: z.string().email(),
  emailVerified: z.boolean(),
  standing: z.enum(["REGISTERED", "ACTIVE", "SUSPENDED"]),
  session: z.enum(["SESSION_CLOSED", "SESSION_OPEN"]),
  roles: z.array(z.string()),
  outsideProver: z.string().nullable(),
});

export type UserResource = z.infer<typeof UserResourceSchema>;
