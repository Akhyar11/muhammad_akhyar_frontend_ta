// Define the initial interface for the AuthState
export interface AuthState {
  token?: string;
  error?: any;
  status?: "idle" | "loading" | "succeeded" | "failed";
}

// Define the enum for the action types
export enum AuthActionTypes {
  // AUTH LOGIC ACTIONS
  LOGIN = "login",
  REGISTER = "register",
  LOGOUT = "logout",
  // LOGIN LOGIC ACTIONS
  LOGIN_SUCCESS = "login_success",
  LOGIN_FAILURE = "login_failure",
  // REGISTER LOGIC ACTIONS
  REGISTER_SUCCESS = "register_success",
  REGISTER_FAILURE = "register_failure",
  // LOGOUT LOGIC ACTIONS
  LOGOUT_SUCCESS = "logout_success",
  LOGOUT_FAILURE = "logout_failure",
}

export interface AuthAction {
  type: AuthActionTypes;
  payload?: AuthState;
}
