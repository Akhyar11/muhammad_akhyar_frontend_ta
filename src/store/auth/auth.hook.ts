import { AuthActionTypes } from "./auth.type";
import { useAtom } from "jotai";
import { authAtom } from "./auth.store";
import { axiosInstance } from "@/utils/axios.config";
import axios from "axios";

export default function useAuth() {
  const [state, authDispatch] = useAtom(authAtom);

  const login = (username: string, password: string) => {
    authDispatch({ type: AuthActionTypes.LOGIN });

    axiosInstance
      .post("/login", { username, password })
      .then((response) => {
        // Save token to local storage
        localStorage.setItem("token", response.data.token);

        // Save token to local storagem
        authDispatch({
          type: AuthActionTypes.LOGIN_SUCCESS,
          payload: {
            token: response.data.token,
            status: "succeeded",
            error: undefined,
          },
        });
      })
      .catch((error) => {
        authDispatch({
          type: AuthActionTypes.LOGIN_FAILURE,
          payload: {
            error: error.response.data.message,
            status: "failed",
          },
        });
      });
  };

  const register = (values: any) => {
    authDispatch({ type: AuthActionTypes.REGISTER });

    values.jk = values.jk === "Laki-laki" ? true : false;

    axiosInstance
      .post("/register", values)
      .then(() => {
        authDispatch({
          type: AuthActionTypes.REGISTER_SUCCESS,
          payload: {
            status: "succeeded",
            error: undefined,
          },
        });
      })
      .catch((error) => {
        if (axios.isAxiosError(error) && error.response)
          authDispatch({
            type: AuthActionTypes.REGISTER_FAILURE,
            payload: {
              error: error.response.data.message,
              status: "failed",
            },
          });
      });
  };

  const logout = () => {
    authDispatch({ type: AuthActionTypes.LOGOUT });

    axiosInstance
      .post("/logout", { token: state.token })
      .then(() => {
        // Remove token from local storage
        localStorage.removeItem("token");

        authDispatch({
          type: AuthActionTypes.LOGOUT_SUCCESS,
          payload: {
            status: "succeeded",
            error: undefined,
          },
        });
      })
      .catch((error) => {
        if (axios.isAxiosError(error) && error.response)
          authDispatch({
            type: AuthActionTypes.LOGOUT_FAILURE,
            payload: {
              error: error.response.data.message,
              status: "failed",
            },
          });
      });
  };

  const initAuth = () => {
    const token = localStorage.getItem("token");
    if (token) {
      authDispatch({
        type: AuthActionTypes.LOGIN_SUCCESS,
        payload: {
          token,
        },
      });
    }
  };

  const getToken = () => {
    const token = localStorage.getItem("token");
    if (token) return token;
    else "";
  };

  return {
    login,
    register,
    logout,
    initAuth,
    token: state.token,
    status: state.status,
    error: state.error,
    getToken,
  };
}
