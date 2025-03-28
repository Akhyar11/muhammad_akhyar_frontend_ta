import { useAtom } from "jotai";
import { userAtom } from "./user.store";
import axios, { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axios.config";
import useAuth from "../auth/auth.hook";
import { getFromLocalStorage } from "@/utils/utils";

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

  const getUser = () => {
    const user = getFromLocalStorage("user_bmi_sistem");
    const data = user
      ? (user as {
          id: string;
          username: string;
          token: string;
          jk: boolean;
          tgl_lahir: string;
          nama_lengkap: string;
          summary: string;
          avatarUrl: string;
          userId: string;
          avatarFileId: string;
        })
      : null;
    if (data) {
      data.avatarUrl = "/api/proxy?id=" + data.avatarFileId;
    }
    return data;
  };

  return {
    ...state,
    me,
    updateUser,
    getUser,
  };
}
