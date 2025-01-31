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
        type: post.type,
        width: post.width,
        accept_logo: post.accept_logo,
        square_height: post.square_height,
        square_width: post.square_width,
        square_x: post.square_x,
        square_y: post.square_y
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
  take: number
) => {
  try {
    const posts = await prisma.posts.findMany({
      take,
      skip
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
