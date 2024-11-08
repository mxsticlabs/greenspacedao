import { SessionProvider, useSession } from "next-auth/react";

import { OktoProvider, BuildType } from "okto-sdk-react";
import { useState } from "react";
import { NextAuthSession } from "src/types";

const oktoApiKey = process.env.NEXT_PUBLIC_OKTO_API_KEY!;
export default function OktoNextAuthProvider({
  children,
  session
}: {
  children: React.ReactNode;
  session: NextAuthSession;
}) {
  const [apiKey] = useState(oktoApiKey);
  const [buildType] = useState(BuildType.SANDBOX);
  return (
    <SessionProvider session={session}>
      <OktoProvider apiKey={apiKey} buildType={buildType}>
        {children}
      </OktoProvider>
    </SessionProvider>
  );
}
type UpdateSession = (data?: any) => Promise<NextAuthSession | null>;

export const useNextAuthSession = () =>
  useSession() as {
    data: NextAuthSession | null;
    status: "authenticated" | "loading" | "unauthenticated";
    update: UpdateSession;
  };
