import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { useUser } from "@/hooks/use-user";
import { useCurrentTab } from "@/hooks/use-current-tab";
import { useComments } from "@/hooks/use-comments";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  RiAddLine,
  RiArrowDownLine,
  RiArrowUpLine,
  RiHeartFill,
  RiLoader2Line,
  RiStarFill,
  RiThumbDownFill,
  RiThumbUpFill,
  RiUserFill,
} from "react-icons/ri";
import { Button } from "@/components/ui/button";
import _ from "lodash";
import { AddCommentDialog } from "@/components/add-comment-dialog";
import { Toaster } from "@/components/ui/sonner";
import { Fragment } from "react/jsx-runtime";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { dayjs } from "@/lib/dayjs";
import { Comment } from "@/lib/type";
import { useLove } from "@/hooks/use-love";
import { useState } from "react";

export default function App() {
  const user = useUser();
  const currentTab = useCurrentTab();
  const comments = useComments({ url: currentTab?.cleanedUrl });

  return (
    <>
      <main className="p-3 space-y-4 text-base">
        <div className="flex items-center justify-between gap-2">
          <div className="text-2xl font-semibold">WorthIt</div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon">
                <RiUserFill />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuItem>
                <RiUserFill />
                {!user.data ? (
                  <Skeleton className="w-full h-4" />
                ) : (
                  user.data.displayName
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Card className="p-3">
          {!currentTab ? (
            <div className="space-y-1">
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-3/4 h-4" />
            </div>
          ) : (
            <div className="space-y-1">
              <div className="line-clamp-1 text-sm">{currentTab.title}</div>
              <div className="break-all font-mono line-clamp-1 text-xs">
                {currentTab.cleanedUrl}
              </div>
            </div>
          )}
        </Card>
        <div className="flex items-center justify-between gap-2">
          <div className="text-xl font-semibold">Is it worth it?</div>
          <AddCommentDialog url={currentTab?.cleanedUrl}>
            <Button size="icon" variant="outline">
              <RiAddLine />
            </Button>
          </AddCommentDialog>
        </div>
        <div className="space-y-4">
          {comments.isPending ? (
            _.range(5).map((i) => <Skeleton className="w-full h-14" key={i} />)
          ) : comments.data?.length ? (
            comments.data?.map((comment, i, cs) => (
              <Fragment key={i}>
                <CommentItem comment={comment} />
                {i !== cs.length - 1 && <Separator />}
              </Fragment>
            ))
          ) : (
            <div className="text-center text-muted-foreground py-8">
              No comments here yet!
            </div>
          )}
        </div>
      </main>
      <Toaster />
    </>
  );
}

function CommentItem({ comment }: { comment: Comment }) {
  const [love, setLove] = useState({
    love: comment.love,
    isLoved: false,
  });

  const { love: loveMutation, unlove: unloveMutation } = useLove({
    commentId: comment.id,
    onSuccess: (data) => {
      setLove(data);
    },
  });

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 flex-wrap">
        <RiUserFill className="size-7 rounded-full bg-muted-foreground/10 p-1" />
        <div className="text-sm font-medium">{comment.user_name}</div>

        <div className="flex items-center gap-2 ml-auto">
          {[
            {
              label: "Yes",
              icon: RiThumbUpFill,
              color: "text-green-400",
              value: true,
            },
            {
              label: "No",
              icon: RiThumbDownFill,
              color: "text-red-400",
              value: false,
            },
          ].map((i) => (
            <i.icon
              key={i.label}
              className={cn(
                comment.vote === i.value ? i.color : "text-gray-300",
                "size-5"
              )}
            />
          ))}
        </div>
      </div>
      <div className="whitespace-pre-wrap max-h-[200px] overflow-y-auto">
        {comment.comment}
      </div>
      <div className="text-xs text-muted-foreground flex items-center gap-1">
        <div className="line-clamp-1">
          {dayjs.utc(comment.created_at).format("YYYY-MM-DD HH:mm:ss")} (
          {dayjs.utc(comment.created_at).fromNow()})
        </div>
        <div className="flex-1" />
        <Button
          size="xs"
          variant="ghost"
          onClick={() => {
            if (love.isLoved) {
              unloveMutation.mutate(comment.id);
            } else {
              loveMutation.mutate(comment.id);
            }
          }}
          disabled={loveMutation.isPending || unloveMutation.isPending}
        >
          {loveMutation.isPending || unloveMutation.isPending ? (
            <RiLoader2Line className="animate-spin" />
          ) : (
            <RiHeartFill
              className={cn(love.isLoved ? "text-pink-400" : "text-gray-300")}
            />
          )}
          {love.love}
        </Button>
      </div>
    </div>
  );
}
