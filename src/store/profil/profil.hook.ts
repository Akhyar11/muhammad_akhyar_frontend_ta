import { useAtom } from "jotai";
import { profilAtom, ProfilState } from "./profil.store";
import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axios.config";
import { useAuth } from "../auth.store";
import { useUser } from "../user.store";

export default function useProfil() {
  const [state, profilDispatch] = useAtom(profilAtom);
  const { user } = useUser();
  const { getToken } = useAuth();
  const token = getToken();

  const getPicture = async (id?: string) => {
    profilDispatch({ payload: { status: "loading" } });

    try {
      const responseGetPicture = await axiosInstance.get(
        `/profils/${state.profil?.id || id}/avatar`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        },
      );

      const gambar = URL.createObjectURL(responseGetPicture.data);

      if (state.profil) {
        const profil: ProfilState = {
          profil: {
            avatarUrl: gambar,
            id: state.profil?.id || (id as string),
            nama_lengkap: state.profil?.nama_lengkap as string,
          },

          status: "succeeded",
        };
        profilDispatch({ payload: profil });
      }
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        profilDispatch({
          payload: {
            error: "Can't get picture user",
            status: "failed",
          },
        });
      }
    }
  };

  const getProfil = async () => {
    profilDispatch({ payload: { status: "loading" } });

    try {
      if ((user as any).id) {
        const response = await axiosInstance.get(
          "/profils/user/" + (user as any).id,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const profil: ProfilState = {
          profil: {
            avatarUrl: "",
            id: response.data.id,
            nama_lengkap: response.data.nama_lengkap,
          },

          status: "succeeded",
        };

        profilDispatch({ payload: profil });
        getPicture(response.data.id);
      }
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        profilDispatch({
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

  const updatePicture = async (formData: any, cb?: Function) => {
    profilDispatch({ payload: { status: "loading" } });

    try {
      await axiosInstance.post(
        `/profils/${state.profil?.id}/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      getPicture();

      if (cb) cb();
    } catch (error) {
      if (error instanceof AxiosError) {
        profilDispatch({
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

  const updateProfil = async (body: any, cb: Function = () => {}) => {
    profilDispatch({ payload: { status: "loading" } });
    try {
      const response = await axiosInstance.put(
        `/profils/${state.profil?.id}`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const oldProfil = state.profil;

      if (oldProfil) {
        profilDispatch({
          payload: {
            status: "succeeded",
            profil: {
              ...oldProfil,
              nama_lengkap: body.nama_lengkap,
            },
          },
        });
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        profilDispatch({
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

  const deleteAvatar = async (cb?: Function) => {
    profilDispatch({ payload: { status: "loading" } });

    try {
      const response = await axiosInstance.delete(
        `/profils/${state.profil?.id}/avatar`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (state.profil) {
        profilDispatch({
          payload: {
            status: "succeeded",
            profil: {
              ...state.profil,
              avatarUrl: "",
            },
          },
        });
      }

      if (cb) cb();
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        profilDispatch({
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
    getProfil,
    deleteAvatar,
    updatePicture,
    updateProfil,
  };
}
