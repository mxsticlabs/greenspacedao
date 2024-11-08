import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      auth_id: string;
      username?: string;
      avatar: ?string;
      fullName?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: number;
    auth_id: string;
    username?: string;
    avatar: ?string;
    fullName?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number;
    auth_id: string;
    username?: string;
  }
}
