import { atomWithReducer } from "jotai/utils";

export interface ProfilState {
  profil?: {
    id: string;
    nama_lengkap: string;
    avatarUrl: string;
  };
  error?: any;
  status?: "idle" | "loading" | "succeeded" | "failed";
}

export interface ProfilAction {
  payload?: ProfilState;
}

const initialState: ProfilState = {
  profil: {
    id: "",
    avatarUrl: "",
    nama_lengkap: "",
  },

  error: undefined,
  status: "idle",
};

const profilReducer = (state: ProfilState, action: ProfilAction) => {
  return { ...state, ...action.payload };
};

export const profilAtom = atomWithReducer(initialState, profilReducer);
