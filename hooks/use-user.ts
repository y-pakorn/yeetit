import { User } from "@/lib/type";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { browser } from "wxt/browser";

export const useUser = () => {
  return useQuery({
    queryKey: ["user"],
    staleTime: Infinity,
    queryFn: async () => {
      const userStorage = await browser.storage.local
        .get("user")
        .then((res) => res.user as User | null);
      if (userStorage) {
        const userApi = await axios
          .get(`${import.meta.env.WXT_API_URL}/user/${userStorage.id}`)
          .then(
            (res) =>
              res.data as {
                user_id: string;
                name: string;
              }
          )
          .catch(() => null);

        if (userApi)
          return {
            displayName: userApi.name,
            id: userApi.user_id,
          };
      }

      // If user is not found, register a new user
      const newUser = await axios
        .post(`${import.meta.env.WXT_API_URL}/register-insecure`)
        .then(
          (res) =>
            res.data as {
              user_id: string;
              name: string;
            }
        );
      await browser.storage.local.set({
        user: {
          displayName: newUser.name,
          id: newUser.user_id,
        },
      });
      return {
        displayName: newUser.name,
        id: newUser.user_id,
      };
    },
  });
};
