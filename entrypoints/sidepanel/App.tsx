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
import { RiAddLine, RiStarFill, RiUserFill } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import _ from "lodash";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddCommentDialog } from "@/components/add-comment-dialog";
import { Toaster } from "@/components/ui/sonner";
import { Fragment } from "react/jsx-runtime";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export default function App() {
  const user = useUser();
  const currentTab = useCurrentTab();
  const comments = useComments({ url: currentTab?.cleanedUrl });

  console.log(comments.data);

  return (
    <>
      <main className="p-3 space-y-4 text-base">
        <div className="flex items-center justify-between gap-2">
          <div className="text-2xl font-semibold">Yeetit</div>
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
          <div className="text-xl font-semibold">Comments</div>
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
                <div key={i} className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <RiUserFill className="size-7 rounded-full bg-muted-foreground/10 p-1" />
                    <div className="text-sm font-medium">
                      {comment.user_name}
                    </div>
                    {comment.vote && (
                      <div className="flex items-center gap-0.5 ml-auto">
                        {_.range(5).map((i) => (
                          <RiStarFill
                            key={i}
                            className={cn(
                              "size-3.5",
                              comment.vote >= i + 1
                                ? "text-yellow-500"
                                : "text-gray-300"
                            )}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="whitespace-pre-wrap max-h-[200px] overflow-y-auto">
                    {comment.comment}
                  </div>
                </div>
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
