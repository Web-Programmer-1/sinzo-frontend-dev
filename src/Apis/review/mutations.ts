
















import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addReplyToReview,
  createReview,
  deleteReview,
  reactToReview,
  updateReview,
} from "./apis";
import { reviewKeys } from "./keys";
import {
  TAddReplyPayload,
  TCreateReviewPayload,
  TGetReviewsParams,
  TReactReviewPayload,
  TUpdateReviewPayload,
} from "./types";

type TReviewListInvalidateInput = {
  productId: string;
  params?: TGetReviewsParams;
};

const invalidateReviewList = async (
  queryClient: ReturnType<typeof useQueryClient>,
  input: TReviewListInvalidateInput
) => {
  await queryClient.invalidateQueries({
    queryKey: reviewKeys.list(input.productId),
  });
  await queryClient.invalidateQueries({
    queryKey: reviewKeys.lists(),
  });
};

export const useCreateReview = (invalidateInput?: TReviewListInvalidateInput) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TCreateReviewPayload) => createReview(payload),
    onSuccess: async (_, variables) => {
      await invalidateReviewList(queryClient, {
        productId: invalidateInput?.productId || variables.productId,
      });
    },
  });
};

export const useUpdateReview = (invalidateInput: TReviewListInvalidateInput) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      reviewId,
      payload,
    }: {
      reviewId: string;
      payload: TUpdateReviewPayload;
    }) => updateReview({ reviewId, payload }),
    onSuccess: async () => {
      await invalidateReviewList(queryClient, invalidateInput);
    },
  });
};

export const useAddReplyToReview = (
  invalidateInput: TReviewListInvalidateInput
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      reviewId,
      payload,
    }: {
      reviewId: string;
      payload: any;
    }) => addReplyToReview({ reviewId, payload }),
    onSuccess: async () => {
      await invalidateReviewList(queryClient, invalidateInput);
    },
  });
};

export const useReactToReview = (
  invalidateInput: TReviewListInvalidateInput
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      reviewId,
      payload,
    }: {
      reviewId: string;
      payload: TReactReviewPayload;
    }) => reactToReview({ reviewId, payload }),
    onSuccess: async () => {
      await invalidateReviewList(queryClient, invalidateInput);
    },
  });
};

export const useDeleteReview = (invalidateInput: TReviewListInvalidateInput) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewId: string) => deleteReview(reviewId),
    onSuccess: async () => {
      await invalidateReviewList(queryClient, invalidateInput);
    },
  });
};