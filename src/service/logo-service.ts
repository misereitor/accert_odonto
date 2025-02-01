'use server';

import {
  createLogoReporitory,
  getAllLogoByUserIdRepository
} from '@/repository/logo-repository';
import { logos } from '@prisma/client';
import { getUserByToken } from './user-service';

export const createLogoService = async (logo: logos) => {
  const createLogo = await createLogoReporitory(logo);
  return createLogo;
};

export const getAllLogosByUserIdService = async () => {
  const user = await getUserByToken();
  const logos = await getAllLogoByUserIdRepository(user.id);
  return logos;
};
