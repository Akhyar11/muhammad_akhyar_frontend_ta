import { useAtom } from "jotai";
import { userAtom } from "./user.store";
import axios, { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axios.config";
import useAuth from "../auth/auth.hook";

export default function useUser() {
  const [state, userDispatch] = useAtom(userAtom);
  const { token } = useAuth();

  const me = async (token: string) => {
    userDispatch({
      payload: {
        status: "loading",
      },
    });

    try {
      const response = await axiosInstance.post("/me", { token });

      userDispatch({
        payload: {
          user: response.data.data,
          status: "succeeded",
        },
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        userDispatch({
          payload: {
            error: error.response?.data.message
              ? error.response?.data.message
              : "",
            status: "failed",
          },
        });
      }
    }
  };

  const updateUser = async (body: any, cb: Function = () => {}) => {
    userDispatch({
      payload: {
        status: "loading",
      },
    });

    try {
      const response = await axiosInstance.put(
        `/users/${state.user?.id}`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      userDispatch({
        payload: {
          user: response.data.data,
          status: "succeeded",
        },
      });

      cb();
    } catch (error) {
      if (error instanceof AxiosError) {
        userDispatch({
          payload: {
            error: error.response?.data.message
              ? error.response?.data.message
              : "",
            status: "failed",
          },
        });
      }
    }
  };

  return {
    ...state,
    me,
    updateUser,
  };
}
