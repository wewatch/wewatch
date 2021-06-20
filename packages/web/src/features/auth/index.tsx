import { nanoid } from "nanoid";
import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "common/hooks/redux";

import { visitorLogin } from "./action";
import { setAccessToken, setVisitorId } from "./slice";

const Auth = (): null => {
  const dispatch = useAppDispatch();
  const visitorId = useAppSelector((state) => state.auth.visitorId);
  const accessToken = useAppSelector((state) => state.auth.accessToken);

  if (!visitorId) {
    dispatch(setVisitorId(nanoid()));
    dispatch(setAccessToken(undefined));
  } else if (!accessToken) {
    dispatch(visitorLogin(visitorId));
  }

  return null;
};

export default Auth;
