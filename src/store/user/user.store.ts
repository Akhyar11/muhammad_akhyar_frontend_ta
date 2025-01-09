import { atomWithReducer } from "jotai/utils";
import { UserAction, UserState } from "./user.type";

const intialState: UserState = {
  user: {
    id: "",
    iotIsAllowed: false,
    jk: false,
    tgl_lahir: "",
    username: "",
  },
  error: "",
  status: "idle",
};

const userReducer = (state: UserState, action: UserAction) => {
  return { ...state, ...action.payload };
};

export const userAtom = atomWithReducer(intialState, userReducer);
