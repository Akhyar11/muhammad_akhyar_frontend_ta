import { atomWithReducer } from "jotai/utils";
import { AuthAction, AuthActionTypes, AuthState } from "./auth.type";

// Define the initial state for the AuthState
const initialState: AuthState = {
  token: undefined,
  error: undefined,
  status: "idle",
};

// Define the reducer function for the AuthState
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case AuthActionTypes.LOGIN:
      return { ...state, status: "loading" };
    case AuthActionTypes.REGISTER:
      return { ...state, status: "loading" };
    case AuthActionTypes.LOGOUT:
      return { ...state, status: "idle" };
    case AuthActionTypes.LOGIN_SUCCESS:
      return { ...state, ...action.payload };
    case AuthActionTypes.LOGIN_FAILURE:
      return { ...state, ...action.payload };
    case AuthActionTypes.REGISTER_SUCCESS:
      return { ...state, ...action.payload };
    case AuthActionTypes.REGISTER_FAILURE:
      return { ...state, ...action.payload, token: undefined };
    case AuthActionTypes.LOGOUT_SUCCESS:
      return { ...state, ...action.payload, token: undefined };
    case AuthActionTypes.LOGOUT_FAILURE:
      return { ...state, ...action.payload, token: undefined };
    default:
      return state;
  }
};

// Create the auth store atom
export const authAtom = atomWithReducer(initialState, authReducer);
