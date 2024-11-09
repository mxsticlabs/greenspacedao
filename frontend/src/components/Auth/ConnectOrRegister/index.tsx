import { LoginAndRegisterButtons } from "../LoginAndRegisterButtons";
import { UserMenu } from "../UserMenu";

import { useInAppAuth } from "src/hooks/common";

export const ConnectOrLogout = ({ openModal }: { openModal: () => void }) => {
  const { ready, user } = useInAppAuth();

  return (
    <>
      {!user && <LoginAndRegisterButtons openModal={openModal} />}
      {ready && user && <UserMenu />}
    </>
  );
};
