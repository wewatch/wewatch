import { nanoid } from "nanoid";
import React, { createContext, useContext, useEffect, useState } from "react";

import { UserInfoDTO } from "@/schemas/user";
import authApi from "api/auth";
import { StorageKey } from "common/enums";
import LoadingScreen from "components/LoadingScreen";
import { useLocalStorage } from "hooks/local-storage";

interface AuthContextValue {
  accessToken: string | null;
  visitorId: string;
  user: UserInfoDTO | null;
}

const defaultContext: AuthContextValue = {
  accessToken: null,
  visitorId: "",
  user: null,
};

const AuthContext = createContext<AuthContextValue>(defaultContext);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps): JSX.Element => {
  const [accessToken, setAccessToken] = useLocalStorage(StorageKey.AccessToken);
  const [visitorId, setVisitorId] = useLocalStorage(StorageKey.VisitorId, "");
  const [user, setUser] = useState<UserInfoDTO | null>(null);

  const [triggerGetUserInfo, { data: getUserInfoData }] =
    authApi.endpoints.getUserInfo.useLazyQuery();
  const [triggerVisitorLogin, { data: visitorLoginData }] =
    authApi.endpoints.visitorLogin.useMutation();

  useEffect(() => {
    if (accessToken) {
      triggerGetUserInfo();
    } else if (!visitorId) {
      setVisitorId(nanoid());
    } else {
      triggerVisitorLogin(visitorId);
    }
  }, [
    accessToken,
    visitorId,
    setVisitorId,
    triggerGetUserInfo,
    triggerVisitorLogin,
  ]);

  useEffect(() => {
    if (getUserInfoData) {
      setUser(getUserInfoData);
    }
  }, [getUserInfoData]);

  useEffect(() => {
    if (visitorLoginData) {
      setAccessToken(visitorLoginData.accessToken);
    }
  }, [setAccessToken, visitorLoginData]);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        visitorId,
        user,
      }}
    >
      {user === null ? <LoadingScreen /> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => useContext(AuthContext);
