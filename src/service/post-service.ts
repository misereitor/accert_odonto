'use server';
import {
  getAllPostsByDesignRepository,
  getAllPostsByPaginationRepository,
  savePostRepository
} from '@/repository/post-repository';
import { posts } from '@prisma/client';
import { getUserByToken } from './user-service';

export const savePostService = async (post: posts) => {
  try {
    const savePost = await savePostRepository(post);
    return savePost;
  } catch (error: unknown) {
    throw error;
  }
};

export const getAllPostsByDesignService = async () => {
  const user = await getUserByToken();
  const posts = await getAllPostsByDesignRepository(user.id);
  return posts;
};

export const getAllPostsByPaginationService = async (
  skip: number,
  take: number,
  type_media: number,
  type_post_ids: number[]
) => {
  return await getAllPostsByPaginationRepository(
    skip,
    take,
    type_media,
    type_post_ids
  );
};
