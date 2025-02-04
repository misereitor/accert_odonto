'use server';
import { posts, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const savePostRepository = async (post: posts) => {
  try {
    const savePost = await prisma.posts.create({
      data: {
        filter: post.filter,
        name: post.name,
        path: post.path,
        size: post.size,
        description: post.description,
        user_id: post.user_id,
        active: post.active,
        name_unique: post.name_unique,
        height: post.height,
        type_media: post.type_media,
        type_post_id: post.type_post_id,
        width: post.width,
        accept_logo: post.accept_logo,
        square_height: post.square_height,
        square_width: post.square_width,
        square_x: post.square_x,
        square_y: post.square_y,
        timestampUrl: post.timestampUrl,
        url: post.url
      }
    });
    return savePost;
  } catch (error: unknown) {
    throw error;
  }
};

export const getAllPostsByDesignRepository = async (userId: number) => {
  try {
    const posts = await prisma.posts.findMany({
      where: { user_id: userId }
    });
    return posts;
  } catch (error: unknown) {
    throw error;
  }
};

export const getAllPostsByPaginationRepository = async (
  skip: number,
  take: number,
  type_media: number,
  type_post_ids: number[]
) => {
  try {
    const posts = await prisma.posts.findMany({
      take,
      skip,
      where: {
        type_media,
        type_post_id: {
          in: type_post_ids // Filtra por vários type_post_ids
        }
      },
      include: {
        type_post: true // Inclui o objeto relacionado
      }
    });
    return posts;
  } catch (error: unknown) {
    throw error;
  }
};

export const updateUrlPostRepository = async (
  id: number,
  url: string,
  timestampUrl: Date
) => {
  try {
    await prisma.posts.update({
      where: { id },
      data: {
        url,
        timestampUrl
      }
    });
  } catch (error: unknown) {
    throw error;
  }
};

export const getAllTypePostsRepository = async (type_media: number) => {
  try {
    const types = await prisma.type_post.findMany({
      where: { type_media }
    });
    return types;
  } catch (error: unknown) {
    throw error;
  }
};
