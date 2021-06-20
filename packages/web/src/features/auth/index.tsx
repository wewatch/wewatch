import { nanoid } from "nanoid";
import { useEffect } from "react";

import api from "api";
import { useAppDispatch, useAppSelector } from "common/hooks/redux";

import { setVisitorId } from "./slice";

const Auth = (): null => {
  const dispatch = useAppDispatch();
  const visitorId = useAppSelector((state) => state.auth.visitorId);
  const accessToken = useAppSelector((state) => state.auth.accessToken);

  const [triggerGetUserInfo] = api.endpoints.getUserInfo.useLazyQuery();
  const [triggerVisitorLogin] = api.endpoints.visitorLogin.useMutation();

  useEffect(() => {
    if (accessToken) {
      triggerGetUserInfo(null);
    } else if (!visitorId) {
      dispatch(setVisitorId(nanoid()));
    } else {
      triggerVisitorLogin(visitorId);
    }
  }, [
    dispatch,
    accessToken,
    visitorId,
    triggerGetUserInfo,
    triggerVisitorLogin,
  ]);

  return null;
};

export default Auth;
