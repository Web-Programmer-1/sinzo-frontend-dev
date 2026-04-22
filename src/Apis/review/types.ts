export type TReviewUser = {
  id: string;
  name: string;
  profileImage?: string | null;
};

export type TReviewReply = {
  replyId: string;
  userId: string;
  userName: string;
  userImage?: string | null;
  message: string;
  createdAt: string;
};

export type TReactionType = "LIKE" | "LOVE" | "CARE" | "HAHA";

export type TReviewReactionUser = {
  userId: string;
  type: TReactionType;
};

export type TReviewReactions = {
  like: number;
  love: number;
  care: number;
  haha: number;
  users: TReviewReactionUser[];
};

export type TReview = {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  comment?: string | null;
  replies?: TReviewReply[] | null;
  reactions?: TReviewReactions | null;
  createdAt: string;
  updatedAt: string;
  user: TReviewUser;
};

export type TCreateReviewPayload = {
  productId: string;
  rating: number;
  comment?: string;
};

export type TUpdateReviewPayload = {
  rating?: number;
  comment?: string;
};

export type TAddReplyPayload = {
  action: "ADD_REPLY";
  message: string;
  comment: string;
};

export type TReactReviewPayload = {
  action: "REACTION";
  reactionType: TReactionType;
};

export type TGetReviewsParams = {
  sort?: "oldest" | "latest";
};

export type TReviewsResponse = {
  success: boolean;
  message: string;
  data: TReview[];
};

export type TSingleReviewResponse = {
  success: boolean;
  message: string;
  data: TReview;
};

export type TDeleteReviewResponse = {
  success: boolean;
  message: string;
  data: null;
};






 export interface RelatedProduct {
  id: string;
  slug: string;
  productCardImage: string;
  title: string;
  cardShortTitle?: string;
  price: number;
  badge: string | null;
  stock: number;
  averageRating: number;
  totalReviews: number;
}