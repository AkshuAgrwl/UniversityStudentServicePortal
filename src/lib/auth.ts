import type { Adapter } from "@auth/core/adapters";

import NextAuth from "next-auth";
import { prisma } from "@/lib/prismarc";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { stripUndefined } from "@/utils/object";

import Google from "next-auth/providers/google";

const baseAdapter = PrismaAdapter(prisma);
const adapter: Adapter = {
  ...baseAdapter,

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async createUser({ id, ...data }) {
    const { email, ...updateData } = data;

    return prisma.user.upsert({
      where: { email: email },
      update: stripUndefined(updateData),
      create: stripUndefined(data),
    });
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  // debug: process.env.ENVIRONMENT === "development",
  adapter: adapter,
  providers: [Google({ allowDangerousEmailAccountLinking: true })],
  session: { strategy: "jwt" },
  callbacks: {
    jwt({ token, user, account }) {
      if (user && account) {
        token.id = user.id!;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
