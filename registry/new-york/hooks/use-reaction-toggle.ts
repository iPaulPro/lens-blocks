import {
  AddReactionMutation,
  AddReactionRequest,
  AnyPost,
  invariant,
  PostReactionType,
  PublicClient,
  SessionClient,
  UndoReactionMutation,
  UndoReactionRequest,
} from "@lens-protocol/react";
import { UseAsyncTask, useAsyncTask } from "@/registry/new-york/lib/tasks";
import { ResultAsync } from "@lens-protocol/types";

export type ReactionToggleArgs = {
  session: SessionClient | PublicClient;
  post: AnyPost;
};

type ReactionToggleResult = ResultAsync<void, unknown>;

export const hasUpvoted = (post: AnyPost): boolean => "operations" in post && post.operations?.hasUpvoted === true;

export const useReactionToggle = (): UseAsyncTask<ReactionToggleArgs, void, unknown> => {
  return useAsyncTask((args: ReactionToggleArgs): ReactionToggleResult => {
    invariant(args.session?.isSessionClient(), "You must be authenticated to use this operation");

    return ResultAsync.fromPromise(
      (async () => {
        const post = args.post;
        if (hasUpvoted(post)) {
          const request: UndoReactionRequest = { post: post.id, reaction: PostReactionType.Upvote };
          args.session?.mutation(UndoReactionMutation, { request });
        } else {
          const request: AddReactionRequest = { post: post.id, reaction: PostReactionType.Upvote };
          args.session?.mutation(AddReactionMutation, { request });
        }
      })(),
      error => {
        console.error("Error toggling reaction:", error);
        return error;
      },
    );
  });
};
