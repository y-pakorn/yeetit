import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Comment } from "@/lib/type";

export const useComments = ({ url }: { url?: string | null }) => {
  return useQuery({
    queryKey: ["comments", url],
    queryFn: async () => {
      if (!url) return null;
      const comments = await axios
        .get(`${import.meta.env.WXT_API_URL}/comments?url=${url}`)
        .then((res) => res.data.comments as Comment[]);
      return comments;
    },
  });
};
