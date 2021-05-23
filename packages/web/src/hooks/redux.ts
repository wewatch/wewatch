import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState } from "reducers";
import type { AppDispatch } from "store";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
