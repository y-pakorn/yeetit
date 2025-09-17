import { User } from "@/lib/type";
import { useQuery } from "@tanstack/react-query";
import { browser } from "wxt/browser";

export const useUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const user: User | null = await browser.runtime.sendMessage({
        type: "GET_USER",
      });
      if (user) {
        return user;
      }
      const newUser: User = await browser.runtime.sendMessage({
        type: "REGISTER_USER",
      });
      return newUser;
    },
  });
};
