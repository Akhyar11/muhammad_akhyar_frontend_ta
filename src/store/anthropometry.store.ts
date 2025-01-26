import { axiosInstance } from "@/utils/axios.config";
import { atom, useAtom } from "jotai";
import { atomWithReducer } from "jotai/utils";
import { useAuth } from "./auth.store";

// Tipe untuk data dan state Anthropometry
interface AnthropometryState {
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

interface AnthropometryAction {
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
  payload?: Partial<AnthropometryState>;
}

const anthropometryReducer = (
  state: AnthropometryState,
  action: any,
): AnthropometryState => {
  switch (action.type) {
    case "SET_LOADING_CREATE":
      return {
        ...state,
        loading: { ...state.loading, create: action.payload?.loading },
      };
    case "SET_LOADING_READ":
      return {
        ...state,
        loading: { ...state.loading, read: action.payload?.loading },
      };
    case "SET_LOADING_UPDATE":
      return {
        ...state,
        loading: { ...state.loading, update: action.payload?.loading },
      };
    case "SET_LOADING_DELETE":
      return {
        ...state,
        loading: { ...state.loading, delete: action.payload?.loading },
      };
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

const initialState: AnthropometryState = {
  data: [],
  dataSelect: {},
  loading: { create: false, read: false, update: false, delete: false },
  error: { create: null, read: null, update: null, delete: null },
};

export const anthropometryAtom = atomWithReducer(
  initialState,
  anthropometryReducer,
);

export const useAnthropometry = () => {
  const [state, dispatch] = useAtom(anthropometryAtom);
  const { getToken, resetAllStateAndCookieAuth, id } = useAuth();
  const token = getToken();

  const setLoading = (
    type: keyof AnthropometryState["loading"],
    value: boolean,
  ) => {
    dispatch({
      type: `SET_LOADING_${type.toUpperCase()}` as AnthropometryAction["type"],
      payload: { loading: value },
    });
  };

  const setError = (
    type: keyof AnthropometryState["error"],
    message: string | null,
  ) => {
    dispatch({
      type: `SET_ERROR_${type.toUpperCase()}` as AnthropometryAction["type"],
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

  const fetchAnthropometry = async () => {
    setLoading("read", true);
    try {
      const response = await axiosInstance.get("/antropomerty/list/" + id, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(response.data.data);
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

  const createAnthropometry = async (values: any, cb: Function = () => {}) => {
    setLoading("create", true);
    try {
      const response = await axiosInstance.post("/anthropometry", values, {
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

  const updateAnthropometry = async (
    id: string,
    values: any,
    cb: Function = () => {},
  ) => {
    setLoading("update", true);
    try {
      const response = await axiosInstance.put(`/anthropometry/${id}`, values, {
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

  const deleteAnthropometry = async (id: string, cb: Function = () => {}) => {
    setLoading("delete", true);
    try {
      await axiosInstance.delete(`/anthropometry/${id}`, {
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
    anthropometry: state.dataSelect,
    fetchAnthropometry,
    createAnthropometry,
    updateAnthropometry,
    deleteAnthropometry,
    resetError,
  };
};
