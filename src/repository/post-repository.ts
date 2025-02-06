'use server';
import { Posts } from '@/model/post-model';
import { posts, PrismaClient, squares } from '@prisma/client';

const prisma = new PrismaClient();

export const savePostRepository = async (post: posts, squares: squares[]) => {
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
        accept_information: post.accept_information,
        accept_logo: post.accept_logo,
        timestampUrl: post.timestampUrl,
        url: post.url,
        squares: {
          create: squares.map((sq) => ({
            type: sq.type,
            x: sq.x,
            y: sq.y,
            width: sq.width,
            height: sq.height
          }))
        }
      },
      include: {
        type_post: true,
        squares: true
      }
    });
    return savePost as unknown as Posts;
  } catch (error: unknown) {
    throw error;
  }
};

export const getAllPostsByDesignRepository = async (
  userId: number,
  skip: number,
  take: number
) => {
  try {
    const posts = await prisma.posts.findMany({
      where: { user_id: userId },
      take,
      skip,
      include: {
        type_post: true,
        squares: true
      }
    });
    return posts as unknown as Posts[];
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
          in: type_post_ids
        }
      },
      include: {
        type_post: true,
        squares: true
      }
    });
    return posts as unknown as Posts[];
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
