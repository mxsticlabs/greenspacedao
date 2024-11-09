import { USER_ACCOUNT_TYPE, UserSelect } from ".";

export interface IAddressToken {
  Link: string;
  Usdt: string;
  Dai: string;
  address: string;
}

export interface IAddressData {
  address: string;
}

export type APP_CONTEXT_STATE = {
  accountType: USER_ACCOUNT_TYPE;
  setAccountType: (data: USER_ACCOUNT_TYPE) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (data: boolean) => void;
  address: string;
  allTokensData: any;
  loading: boolean;
  isUserConnected: boolean;
  isFetchingUser: boolean;
  setIsFetchingUser: (data: boolean) => void;
  setAllTokenData: (data: any) => void;
  setAddress: (data: string) => void;
  setLoading: (data: boolean) => void;
  setIsUserConnected: (data: boolean) => void;

  currentUser: UserSelect | null;
  setCurrentUser: (data: UserSelect | null) => void;

  ensName: any;
  setEnsName: (data: any) => void;
  ensAvatar: any;
  setEnsAvatar: (data: any) => void;
};
export type User = {
  userAddress: string;
  name: string;
  userCidData?: string;
  startDate?: string;
  endDate?: string;
  amount?: string;
};

export type ChatMessages = {
  id: string;
  content: string;
  userAddress: string;
  fullname: string;
  timestamp: Date | number;
};
