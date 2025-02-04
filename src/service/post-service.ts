'use server';
import {
  getAllPostsByDesignRepository,
  getAllPostsByPaginationRepository,
  savePostRepository,
  updateUrlPostRepository
} from '@/repository/post-repository';
import { posts } from '@prisma/client';
import { getUserByToken } from './user-service';
import { generateSignedDownloadUrls } from './files-service';

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
  const now = new Date();
  const nowPlusOneDay = new Date(now.getTime() + 60 * 60 * 24000);

  const posts = await getAllPostsByPaginationRepository(
    skip,
    take,
    type_media,
    type_post_ids
  );

  const updatedPhotos = await Promise.all(
    posts.map(async (post) => {
      if (!post.url || (post.timestampUrl && post.timestampUrl < now)) {
        post.url = await generateSignedDownloadUrls(post.path);
        post.timestampUrl = nowPlusOneDay;
        await updateUrlPostRepository(post.id, post.url, post.timestampUrl);
      }
      return post;
    })
  );

  return updatedPhotos;
};
