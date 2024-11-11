import { useAppContext } from "src/context/state";
import { LoginAndRegisterButtons } from "../LoginAndRegisterButtons";
import { UserMenu } from "../UserMenu";

import { useInAppAuth } from "src/hooks/common";

export const ConnectOrLogout = ({ openModal }: { openModal: () => void }) => {
  const { ready } = useInAppAuth();
  const { currentUser } = useAppContext();
  return (
    <>
      {!currentUser && <LoginAndRegisterButtons openModal={openModal} />}
      {currentUser && <UserMenu />}
    </>
  );
};
