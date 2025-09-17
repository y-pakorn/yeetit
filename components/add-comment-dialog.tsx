import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DialogHeader,
} from "./ui/dialog";
import { useState } from "react";
import { Input } from "./ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import _ from "lodash";
import { RiStarFill } from "react-icons/ri";
import { cn } from "@/lib/utils";
import axios from "axios";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
  comment: z.string().min(1),
  vote: z.number().min(1).max(5).optional().nullable(),
});

export function AddCommentDialog({
  children,
  url,
}: {
  children: React.ReactNode;
  url?: string;
}) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const user = useUser();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comment: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!user.data) return;
    if (!url) return;

    await axios.post(`${import.meta.env.WXT_API_URL}/comment`, {
      comment: data.comment,
      vote: data.vote,
      user_id: user.data.id,
      url: url,
    });
    queryClient.invalidateQueries({ queryKey: ["comments", url], exact: true });
    setOpen(false);
    form.reset();
    toast.success("Comment added successfully");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Comment</DialogTitle>
          <DialogDescription>
            Add a comment to the current page
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comment</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter your comment here"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vote"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      {_.range(5).map((i) => (
                        <RiStarFill
                          key={i}
                          className={cn(
                            "size-6",
                            field.value && field.value >= i + 1
                              ? "text-yellow-500"
                              : "text-gray-300"
                          )}
                          onClick={() => field.onChange(i + 1)}
                        />
                      ))}
                      <Button
                        variant="outline"
                        className="ml-auto"
                        size="sm"
                        type="button"
                        onClick={() => field.onChange(undefined)}
                      >
                        None
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <>
                  Adding...
                  <Loader2 className="animate-spin" />
                </>
              ) : (
                "Add Comment"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
