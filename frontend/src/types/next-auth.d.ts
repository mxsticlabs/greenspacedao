import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      authId: string;
      address?: string;
      username?: string;
      avatar: ?string;
      fullName?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: number;
    authId: string;
    username?: string;
    address?: string;
    avatar: ?string;
    fullName?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number;
    authId: string;
    username?: string;
  }
}
