import { useMutation, useQueryClient } from "@tanstack/react-query";
import { browser } from "wxt/browser";

export const useRefreshUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await browser.storage.local.remove("user");
      await queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};
