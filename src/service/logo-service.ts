'use server';

import {
  createLogoReporitory,
  getAllLogoByUserIdRepository,
  updateUrlLogoRepository
} from '@/repository/logo-repository';
import { logos } from '@prisma/client';
import { getUserByToken } from './user-service';
import { generateSignedDownloadUrls } from './files-service';

export const createLogoService = async (logo: logos) => {
  const createLogo = await createLogoReporitory(logo);
  return createLogo;
};

export const getAllLogosByUserIdService = async () => {
  const now = new Date();
  const nowPlusOneDay = new Date(now.getTime() + 60 * 60 * 24000);
  const user = await getUserByToken();
  const logos = await getAllLogoByUserIdRepository(user.id);
  const updatedPhotos = await Promise.all(
    logos.map(async (logo) => {
      if (!logo.url || (logo.timestampUrl && logo.timestampUrl < now)) {
        logo.url = await generateSignedDownloadUrls(logo.path);
        logo.timestampUrl = nowPlusOneDay;
        await updateUrlLogoRepository(logo.id, logo.url, logo.timestampUrl);
      }
      return logo;
    })
  );
  return updatedPhotos;
};
