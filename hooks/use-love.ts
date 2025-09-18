import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const useLove = ({
  commentId,
  onSuccess,
}: {
  commentId: string;
  onSuccess?: ({ love }: { love: number; isLoved: boolean }) => void;
}) => {
  const user = useUser();

  const love = useMutation({
    mutationFn: async (commentId: string) => {
      if (!user.data) return;
      const response = await axios.post(
        `${import.meta.env.WXT_API_URL}/comment/${commentId}/love?user_id=${
          user.data.id
        }`
      );
      return {
        love: response.data.love,
        isLoved: true,
      };
    },
    onSuccess: (data) => {
      if (data) onSuccess?.(data);
    },
  });

  const unlove = useMutation({
    mutationFn: async (commentId: string) => {
      if (!user.data) return;
      const response = await axios.post(
        `${import.meta.env.WXT_API_URL}/comment/${commentId}/unlove?user_id=${
          user.data.id
        }`
      );
      return {
        love: response.data.love,
        isLoved: false,
      };
    },
    onSuccess: (data) => {
      if (data) onSuccess?.(data);
    },
  });

  return { love, unlove };
};
