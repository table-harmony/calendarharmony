"use server";

import {
  createMagicLinkToken,
  createTokenUseCase,
  deleteMagicLinkTokenByEmail,
  deleteTokenByEmailUseCase,
} from "@/infrastructure/tokens";

import { redirect } from "next/navigation";
import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";

import { getIp } from "@/lib/get-ip";
import { sendEmail } from "@/lib/mail";

import { MagicLinkEmail } from "@/components/emails/magic-link";

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.fixedWindow(2, "10s"),
});

export async function magicLinkLoginAction(email: string) {
  try {
    const ip = getIp();
    const { success } = await ratelimit.limit(ip ?? "anonymous011");

    if (!success) throw new Error("Rate limit exceeded!");

    await deleteTokenByEmailUseCase(
      { deleteTokenByEmail: deleteMagicLinkTokenByEmail },
      { email }
    );

    const createdToken = await createTokenUseCase(
      { createToken: createMagicLinkToken },
      { email }
    );

    await sendEmail(
      createdToken.email,
      `Your magic link`,
      MagicLinkEmail({ token: createdToken.token })
    );
  } catch (err) {
    const error = err as Error;
    return {
      error: error.message,
    };
  }

  return redirect("/login/magic");
}
