// Import yang dibutuhkan
import { axiosInstance } from "@/utils/axios.config";
import { atom, useAtom } from "jotai";
import Cookies from "js-cookie";
import { atomWithReducer } from "jotai/utils";
import { useRouter } from "next/navigation";
// Import the saveToLocalStorage utility from the utils module
import { saveToLocalStorage, removeFromLocalStorage } from "@/utils/utils";

// Tipe untuk data dan state Auth
interface AuthState {
  id: string | null;
  username: string | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

interface AuthPayload {
  id?: string;
  username?: string;
  token?: string;
}

interface AuthAction {
  type: "SET_LOADING" | "SET_ERROR" | "SET_AUTH" | "CLEAR_AUTH";
  payload?:
    | {
        id: string | null;
        username: string | null;
        token: string | null;
      }
    | string
    | boolean
    | null;
}

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload as boolean };
    case "SET_ERROR":
      return { ...state, error: action.payload as string | null };
    case "SET_AUTH":
      return {
        ...state,
        id: (action.payload as AuthPayload).id || null,
        username: (action.payload as AuthPayload).username || null,
        token: (action.payload as AuthPayload).token || null,
      };
    case "CLEAR_AUTH":
      return { ...state, id: null, username: null, token: null };
    default:
      return state;
  }
};

const initialState: AuthState = {
  id: null,
  username: null,
  token: null,
  loading: false,
  error: null,
};

// State atom untuk Auth
export const authIdAtom = atom<string | null>(null);
export const authUsernameAtom = atom<string | null>(null);
export const authTokenAtom = atom<string | null>(null);
export const authLoadingAtom = atom<boolean>(false);
export const authErrorAtom = atom<string | null>(null);
export const authAtom = atomWithReducer(initialState, authReducer);

export const useAuth = () => {
  const [id, setId] = useAtom(authIdAtom);
  const [username, setUsername] = useAtom(authUsernameAtom);
  const [token, setToken] = useAtom(authTokenAtom);
  const [state, dispatch] = useAtom(authAtom);

  const router = useRouter();

  // Fungsi login
  const login = async (
    username: string,
    password: string,
    cb: Function = () => {},
  ): Promise<void> => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await axiosInstance.post<{
        id: string;
        username: string;
        token: string;
        jk: boolean;
        tgl_lahir: string;
      }>("/login", {
        username,
        password,
      });

      const {
        id,
        token,
        username: fetchedUsername,
        jk,
        tgl_lahir,
      } = response.data;

      setId(id);
      setUsername(fetchedUsername);
      setToken(token);

      // Set cookies for persistent auth
      Cookies.set("id", id.toString());
      Cookies.set("username", fetchedUsername);
      Cookies.set("token", token);

      // Save user state to browser localStorage
      saveToLocalStorage("user_bmi_sistem", {
        id,
        username: fetchedUsername,
        token,
        jk,
        tgl_lahir,
      });

      dispatch({
        type: "SET_AUTH",
        payload: { id, username: fetchedUsername, token },
      });
      cb();
    } catch (error: any) {
      dispatch({ type: "SET_ERROR", payload: error.response?.data.message });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Fungsi register
  const register = async (
    values: any,
    cb: Function = () => {},
  ): Promise<void> => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      values.jk = values.jk === "Laki-laki" ? true : false;
      await axiosInstance.post("/register", values);
      cb();
    } catch (error: any) {
      dispatch({ type: "SET_ERROR", payload: error.response?.data.message });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Fungsi logout
  const logout = async (): Promise<void> => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      await axiosInstance.post("/logout", { token });

      setId(null);
      setUsername(null);
      setToken(null);

      Cookies.remove("id");
      Cookies.remove("username");
      Cookies.remove("token");

      // Remove user state from localStorage
      removeFromLocalStorage("user_bmi_sistem");

      dispatch({ type: "CLEAR_AUTH" });
    } catch (error: any) {
      dispatch({ type: "SET_ERROR", payload: error.response?.data.message });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Fungsi get user data (/me)
  const fetchUserData = async (): Promise<void> => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      // get token from cookie
      const token = getToken();

      const response = await axiosInstance.post<{
        id: string;
        username: string;
      }>("/me", { token });

      const { id, username: fetchedUsername } = response.data;

      setId(id);
      setUsername(fetchedUsername);

      Cookies.set("id", id.toString());
      Cookies.set("username", fetchedUsername);

      dispatch({
        type: "SET_AUTH",
        payload: { id, username: fetchedUsername, token },
      });
    } catch (error: any) {
      dispatch({ type: "SET_ERROR", payload: error.response?.data.message });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const getToken = () => {
    const token = Cookies.get("token");
    return token ? token : null;
  };

  const resetAllStateAndCookieAuth = () => {
    setId(null);
    setUsername(null);
    setToken(null);

    Cookies.remove("id");
    Cookies.remove("username");
    Cookies.remove("token");

    // Remove user state from localStorage
    removeFromLocalStorage("user_bmi_sistem");

    dispatch({ type: "CLEAR_AUTH" });
    router.push("/auth/login");
  };

  const resetError = () => {
    dispatch({ type: "SET_ERROR", payload: null });
  };

  return {
    state,
    id: Cookies.get("id"),
    username,
    token,
    loading: state.loading,
    error: state.error,
    login,
    register,
    logout,
    fetchUserData,
    getToken,
    resetError,
    resetAllStateAndCookieAuth,
  };
};
