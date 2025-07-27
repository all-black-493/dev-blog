import { z } from 'zod'

export const addPostSchema = z.object({
  title: z.string().min(3),
  summary: z.string().min(10),
  content: z.string().nullable(),
})

export const editPostSchema = z.object({
  postId: z.string().uuid(),
  title: z.string().min(3),
  summary: z.string().min(10),
  content: z.string().nullable(),
})

export const deletePostSchema = z.object({
  postId: z.string().uuid(),
})

export const likePostSchema = z.object({
  postId: z.string().uuid(),
});

export const dislikePostSchema = z.object({
  postId: z.string().uuid(),
});


export const getPostSchema = z.object({
  postId: z.string().uuid({
    message: "Invalid post ID",
  }),
});

export const toggleFeaturedSchema = z.object({
  postId: z.string().uuid(),
  featured: z.boolean(),
});


export const addCommentSchema = z.object({
  postId: z.string().uuid(),
  content: z.string().min(1),
})

export const toggleCommentLikeSchema = z.object({
  commentId: z.string().uuid(),
})

export const editCommentSchema = z.object({
  commentId: z.string().uuid(),
  content: z.string().min(1),
})

export const deleteCommentSchema = z.object({
  commentId: z.string().uuid(),
})

export const getCommentsForPostSchema = z.object({
  postId: z.string().uuid(),
});

export const createCommentReplySchema = z.object({
  postId: z.string(),
  parentCommentId: z.string(),
  content: z.string().min(1, "Reply content is required"),
});

export const likeCommentSchema = z.object({
  commentId: z.string(),
});

export const registerUserSchema = z.object({
  email: z.string().email(),
  password: z.string()
    .min(8, "Password must be at least 8 characters long")
    .max(30, "Password cannot exceed 30 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  username: z.string().max(30).min(6)
});

export const loginWithMagicLinkSchema = z.object({
  email: z.string().email(),
});

export const pwloginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const resetSchema = z.object({
  email: z.string().email(),
});
