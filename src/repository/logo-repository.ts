'use server';

import { logos, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const createLogoReporitory = async (logo: logos) => {
  try {
    const createLogo = await prisma.logos.create({
      data: {
        width: logo.width,
        height: logo.height,
        user_id: logo.user_id,
        name: logo.name,
        name_unique: logo.name_unique,
        path: logo.path,
        url: logo.url,
        timestampUrl: logo.timestampUrl
      }
    });
    return createLogo;
  } catch (error: unknown) {
    console.error('Erro ao criar logo', error);
    throw error;
  }
};

export const getAllLogoByUserIdRepository = async (user_id: number) => {
  try {
    const logos = await prisma.logos.findMany({
      where: {
        user_id
      }
    });
    return logos;
  } catch (error: unknown) {
    console.error('Erro ao criar logo', error);
    throw error;
  }
};

export const updateUrlLogoRepository = async (
  id: number,
  url: string,
  timestampUrl: Date
) => {
  try {
    await prisma.logos.update({
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
