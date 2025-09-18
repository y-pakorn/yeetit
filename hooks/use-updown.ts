import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const useUpdown = ({
  commentId,
  onSuccess,
}: {
  commentId: string;
  onSuccess?: ({ up, down }: { up: number; down: number }) => void;
}) => {
  const up = useMutation({
    mutationFn: async (commentId: string) => {
      const response = await axios.post(
        `${import.meta.env.WXT_API_URL}/comment/${commentId}/up`,
        {
          commentId,
        }
      );
      return response.data as {
        up: number;
        down: number;
      };
    },
    onSuccess: (data) => {
      onSuccess?.(data);
    },
  });

  const down = useMutation({
    mutationFn: async (commentId: string) => {
      const response = await axios.post(
        `${import.meta.env.WXT_API_URL}/comment/${commentId}/down`,
        {
          commentId,
        }
      );
      return response.data as {
        up: number;
        down: number;
      };
    },
    onSuccess: (data) => {
      onSuccess?.(data);
    },
  });

  return { up, down };
};
