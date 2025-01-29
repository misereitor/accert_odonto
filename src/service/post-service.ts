import {
  getAllPostsByDesignRepository,
  savePostRepository
} from '@/repository/post-repository';
import { posts } from '@prisma/client';
import { getUserByToken } from './user-service';

export const savePostService = async (post: posts) => {
  try {
    const user = await getUserByToken();
    post.user_id = user.id;
    const savePost = await savePostRepository(post);
    return savePost;
  } catch (error: unknown) {
    throw error;
  }
};

export const getAllPostsByDesignService = async () => {
  const user = await getUserByToken();
  const posts = await getAllPostsByDesignRepository(user.id);
};
