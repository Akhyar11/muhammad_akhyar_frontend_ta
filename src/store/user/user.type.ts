// Define the initial interface for the UserState
export interface UserState {
  user?: {
    id: string;
    iotIsAllowed: boolean;
    jk: boolean;
    tgl_lahir: string;
    username: string;
  };

  error?: any;
  status?: "idle" | "loading" | "succeeded" | "failed";
}

export interface UserAction {
  payload?: UserState;
}
