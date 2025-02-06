'use server';
import {
  getAllPostsByDesignRepository,
  getAllPostsByPaginationRepository,
  savePostRepository,
  updateUrlPostRepository
} from '@/repository/post-repository';
import { posts, squares } from '@prisma/client';
import { getUserByToken } from './user-service';
import { generateSignedDownloadUrls } from './files-service';
import { Posts } from '@/model/post-model';

export const savePostService = async (post: posts, squares: squares[]) => {
  try {
    console.log(post);
    const savePost = await savePostRepository(post, squares);
    return savePost;
  } catch (error: unknown) {
    throw error;
  }
};

export const getAllPostsByDesignService = async (
  skip: number,
  take: number
) => {
  const user = await getUserByToken();
  const posts = await getAllPostsByDesignRepository(user.id, skip, take);
  return posts;
};

export const getAllPostsByPaginationService = async (
  skip: number,
  take: number,
  type_media: number,
  type_post_ids: number[]
) => {
  const posts = await getAllPostsByPaginationRepository(
    skip,
    take,
    type_media,
    type_post_ids
  );

  const updatedPhotos = await updateUrlPhotoService(posts);

  return updatedPhotos;
};

const updateUrlPhotoService = async (posts: Posts[]) => {
  const now = new Date();
  const nowPlusOneDay = new Date(now.getTime() + 60 * 60 * 24000);
  const updatedPhotos = await Promise.all(
    posts.map(async (post) => {
      if (post.timestampUrl && post.timestampUrl < now) {
        post.url = await generateSignedDownloadUrls(post.path);
        post.timestampUrl = nowPlusOneDay;
        await updateUrlPostRepository(post.id, post.url, post.timestampUrl);
      }
      return post;
    })
  );
  return updatedPhotos;
};
