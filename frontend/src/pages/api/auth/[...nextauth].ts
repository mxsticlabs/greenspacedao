import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import type { AuthOptions } from "next-auth";
import { db } from "src/db";
import { users } from "src/db/schema";
import { eq } from "drizzle-orm";

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    })
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) return false;

      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, user.email)
      });

      if (!existingUser) {
        await db.insert(users).values({
          email: user.email,
          fullName: user.name || "",
          authId: account?.providerAccountId || "",
          avatar: user.image || "",
          emailVerified: true
        });

        const createdUser = await db.query.users.findFirst({
          where: eq(users.email, user.email)
        });

        if (createdUser) {
          user.id = createdUser.id;
          user.username = createdUser.username;
          user.address = createdUser.address as string;
          user.fullName = createdUser.fullName as string;
        }
      } else {
        user.id = existingUser.id;
        user.username = existingUser.username;
        user.authId = existingUser?.authId as string;
        user.address = existingUser.address as string;
        user.fullName = existingUser.fullName as string;
      }

      return true;
    },
    async jwt({ token, user, account }) {
      if (account) {
        token.id_token = account.id_token;
      }
      if (user) {
        token.id = user.id as number;
        token.authId = user.authId;
        token.username = user.username;
        token.address = user.address;
        token.fullName = user.fullName;
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        id_token: token.id_token as string,
        user: {
          ...session.user,
          id: token.id,
          authId: token?.authId,
          username: token.username,
          address: token.address,
          fullName: token.fullName
        }
      };
    }
  }
};

const handler = NextAuth(authOptions);

export default handler;
