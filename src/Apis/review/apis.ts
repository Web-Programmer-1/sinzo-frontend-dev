// import { apiClient } from "../../lib/axios/apiClient";
// import { reviewEndpoints } from "./endpoints";
// import {
//   TCreateReviewPayload,
//   TDeleteReviewResponse,
//   TReviewsResponse,
//   TSingleReviewResponse,
//   TUpdateReviewPayload,
//   TAddReplyPayload,
//   TReactReviewPayload,
// } from "./types";

// export const createReview = async (
//   payload: TCreateReviewPayload
// ): Promise<TSingleReviewResponse> => {
//   const res = await apiClient.post(reviewEndpoints.create, payload);
//   return res.data;
// };

// export const getReviewsByProduct = async (
//   productId: string
// ): Promise<TReviewsResponse> => {
//   const res = await apiClient.get(reviewEndpoints.byProduct(productId));
//   return res.data;
// };

// export const updateReview = async ({
//   reviewId,
//   payload,
// }: {
//   reviewId: string;
//   payload
// }) => {
//   const res = await apiClient.patch(reviewEndpoints.update(reviewId), payload);
//   return res.data;
// };

// export const addReplyToReview = async ({
//   reviewId,
//   payload,
// }: {
//   reviewId: string;
//   payload: TAddReplyPayload;
// }): Promise<TSingleReviewResponse> => {
//   const res = await apiClient.patch(reviewEndpoints.update(reviewId), payload);
//   return res.data;
// };

// export const reactToReview = async ({
//   reviewId,
//   payload,
// }: {
//   reviewId: string;
//   payload: TReactReviewPayload;
// }): Promise<TSingleReviewResponse> => {
//   const res = await apiClient.patch(reviewEndpoints.update(reviewId), payload);
//   return res.data;
// };

// export const deleteReview = async (
//   reviewId: string
// ): Promise<TDeleteReviewResponse> => {
//   const res = await apiClient.delete(reviewEndpoints.delete(reviewId));
//   return res.data;
// };




















import { apiClient } from "../../lib/axios/apiClient";
import { reviewEndpoints } from "./endpoints";
import {
  TCreateReviewPayload,
  TDeleteReviewResponse,
  TReviewsResponse,
  TSingleReviewResponse,
  TUpdateReviewPayload,
  TAddReplyPayload,
  TReactReviewPayload,
} from "./types";

export const createReview = async (
  payload: TCreateReviewPayload
): Promise<TSingleReviewResponse> => {
  const res = await apiClient.post(reviewEndpoints.create, payload);
  return res.data;
};

export const getReviewsByProduct = async (
  productId: string,
  sort?: string
): Promise<TReviewsResponse> => {
  const res = await apiClient.get(reviewEndpoints.byProduct(productId), {
    params: sort ? { sort } : undefined,
  });
  return res.data;
};

export const updateReview = async ({
  reviewId,
  payload,
}: {
  reviewId: string;
  payload: TUpdateReviewPayload;
}) => {
  const res = await apiClient.patch(reviewEndpoints.update(reviewId), payload);
  return res.data;
};

export const addReplyToReview = async ({
  reviewId,
  payload,
}: {
  reviewId: string;
  payload: any;
}) => {
  const res = await apiClient.patch(reviewEndpoints.update(reviewId), payload);
  return res.data;
};

export const reactToReview = async ({
  reviewId,
  payload,
}: {
  reviewId: string;
  payload: TReactReviewPayload;
}): Promise<TSingleReviewResponse> => {
  const res = await apiClient.patch(reviewEndpoints.update(reviewId), payload);
  return res.data;
};

export const deleteReview = async (
  reviewId: string
): Promise<TDeleteReviewResponse> => {
  const res = await apiClient.delete(reviewEndpoints.delete(reviewId));
  return res.data;
};


export const getRelatedProducts = async (
  productId: string,
  limit = 8
) => {
  const res = await apiClient.get(`/products/related/${productId}?limit=${limit}`);
  return res.data;
};