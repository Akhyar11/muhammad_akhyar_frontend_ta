import { axiosInstance } from "@/utils/axios.config";
import { atom, useAtom } from "jotai";
import { atomWithReducer } from "jotai/utils";
import { useAuth } from "./auth.store";

// Tipe untuk data dan state User
interface UserState {
  data: any[];
  dataSelect: object;
  loading: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  };
  error: {
    create: string | null;
    read: string | null;
    update: string | null;
    delete: string | null;
  };
}

interface UserAction {
  type:
    | "SET_LOADING_CREATE"
    | "SET_LOADING_READ"
    | "SET_LOADING_UPDATE"
    | "SET_LOADING_DELETE"
    | "SET_ERROR_CREATE"
    | "SET_ERROR_READ"
    | "SET_ERROR_UPDATE"
    | "SET_ERROR_DELETE"
    | "SET_DATA"
    | "SET_DATA_SELECT"
    | "CLEAR_DATA";
  payload?: Partial<UserState>;
}

const userReducer = (state: UserState, action: any): UserState => {
  switch (action.type) {
    case "SET_LOADING_CREATE":
      return { ...state, loading: { ...state.loading, create: true } };
    case "SET_LOADING_READ":
      return { ...state, loading: { ...state.loading, read: true } };
    case "SET_LOADING_UPDATE":
      return { ...state, loading: { ...state.loading, update: true } };
    case "SET_LOADING_DELETE":
      return { ...state, loading: { ...state.loading, delete: true } };
    case "SET_ERROR_CREATE":
      return {
        ...state,
        error: { ...state.error, create: action.payload?.error || null },
      };
    case "SET_ERROR_READ":
      return {
        ...state,
        error: { ...state.error, read: action.payload?.error || null },
      };
    case "SET_ERROR_UPDATE":
      return {
        ...state,
        error: { ...state.error, update: action.payload?.error || null },
      };
    case "SET_ERROR_DELETE":
      return {
        ...state,
        error: { ...state.error, delete: action.payload?.error || null },
      };
    case "SET_DATA":
      return { ...state, data: action.payload?.data || [] };
    case "SET_DATA_SELECT":
      return { ...state, dataSelect: action.payload?.dataSelect };
    case "CLEAR_DATA":
      return {
        data: [],
        dataSelect: {},
        loading: { create: false, read: false, update: false, delete: false },
        error: { create: null, read: null, update: null, delete: null },
      };
    default:
      return state;
  }
};

const initialState: UserState = {
  data: [],
  dataSelect: {},
  loading: { create: false, read: false, update: false, delete: false },
  error: { create: null, read: null, update: null, delete: null },
};

export const userAtom = atomWithReducer(initialState, userReducer);

export const useUser = () => {
  const [state, dispatch] = useAtom(userAtom);
  const { getToken, resetAllStateAndCookieAuth } = useAuth();
  const token = getToken();

  const setLoading = (type: keyof UserState["loading"], value: boolean) => {
    dispatch({
      type: `SET_LOADING_${type.toUpperCase()}` as UserAction["type"],
    });
  };

  const setError = (type: keyof UserState["error"], message: string | null) => {
    dispatch({
      type: `SET_ERROR_${type.toUpperCase()}` as UserAction["type"],
      payload: { error: message },
    });
  };

  const setData = (data: any[]) => {
    dispatch({ type: "SET_DATA", payload: { data } });
  };

  const setDataSelect = (dataSelect: any) => {
    dispatch({ type: "SET_DATA_SELECT", payload: { dataSelect } });
  };

  const clearData = () => {
    dispatch({ type: "CLEAR_DATA" });
  };

  const me = async () => {
    setLoading("read", true);
    try {
      const response = await axiosInstance.post("/me", { token });
      setDataSelect(response.data?.data);
    } catch (error: any) {
      const errorMessage = error.response?.data.message;
      if (errorMessage === "not login, please login") {
        resetAllStateAndCookieAuth();
      }
    } finally {
      setLoading("read", false);
    }
  };

  const createUser = async (values: any, cb: Function = () => {}) => {
    setLoading("create", true);
    try {
      const response = await axiosInstance.post("/users", values, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData([response.data]);
      cb();
    } catch (error: any) {
      const errorMessage = error.response?.data.message;
      setError("create", errorMessage);
      if (errorMessage === "not login, please login") {
        resetAllStateAndCookieAuth();
      }
    } finally {
      setLoading("create", false);
    }
  };

  const readUser = async (userId: string) => {
    setLoading("read", true);
    try {
      const response = await axiosInstance.get(`/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData([response.data]);
    } catch (error: any) {
      const errorMessage = error.response?.data.message;
      setError("read", errorMessage);
      if (errorMessage === "not login, please login") {
        resetAllStateAndCookieAuth();
      }
    } finally {
      setLoading("read", false);
    }
  };

  const updateUser = async (
    userId: string,
    values: any,
    cb: Function = () => {},
  ) => {
    setLoading("update", true);
    try {
      const response = await axiosInstance.put(`/users/${userId}`, values, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData([response.data]);
      cb();
    } catch (error: any) {
      const errorMessage = error.response?.data.message;
      setError("update", errorMessage);
      if (errorMessage === "not login, please login") {
        resetAllStateAndCookieAuth();
      }
    } finally {
      setLoading("update", false);
    }
  };

  const deleteUser = async (userId: string, cb: Function = () => {}) => {
    setLoading("delete", true);
    try {
      await axiosInstance.delete(`/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      clearData();
      cb();
    } catch (error: any) {
      const errorMessage = error.response?.data.message;
      setError("delete", errorMessage);
      if (errorMessage === "not login, please login") {
        resetAllStateAndCookieAuth();
      }
    } finally {
      setLoading("delete", false);
    }
  };

  const resetError = () => {
    dispatch({
      type: "SET_ERROR_CREATE",
      payload: { error: null },
    });
    dispatch({
      type: "SET_ERROR_READ",
      payload: { error: null },
    });
    dispatch({
      type: "SET_ERROR_UPDATE",
      payload: { error: null },
    });
    dispatch({
      type: "SET_ERROR_DELETE",
      payload: { error: null },
    });
  };

  return {
    ...state,
    user: state.dataSelect,
    me,
    createUser,
    readUser,
    updateUser,
    deleteUser,
    resetError,
  };
};
