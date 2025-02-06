'use server';
import { PrismaClient, users } from '@prisma/client';

const prisma = new PrismaClient();

export const createUserRepository = async (user: users) => {
  try {
    const newUser = await prisma.users.create({
      data: {
        email: user.email,
        password: user.password,
        name: user.name,
        address: null,
        facebook: null,
        instagram: null,
        telephone: null,
        whatsapp: null
      }
    });
    return newUser;
  } catch (error: unknown) {
    console.error('Error creating address:', error);
    throw error;
  }
};

export const getUserByEmailRepository = async (email: string) => {
  try {
    const user = await prisma.users.findUnique({
      where: { email }
    });
    return user;
  } catch (error: unknown) {
    console.error('Error creating address:', error);
    throw error;
  }
};

export const getUserByIdRepository = async (id: number) => {
  try {
    const user = await prisma.users.findUnique({
      where: { id }
    });
    return user;
  } catch (error: unknown) {
    console.error('Error creating address:', error);
    throw error;
  }
};

export const getAllUsersRepository = async () => {
  try {
    const users = await prisma.users.findMany({
      omit: { password: true }
    });
    return users;
  } catch (error: unknown) {
    console.error('Error creating address:', error);
    throw error;
  }
};

export const updateUserRepository = async (user: users) => {
  try {
    const updateUser = await prisma.users.update({
      where: { id: user.id },
      data: {
        name: user.name,
        email: user.email,
        address: user.address,
        facebook: user.facebook,
        instagram: user.instagram,
        whatsapp: user.whatsapp,
        telephone: user.telephone
      }
    });
    return updateUser;
  } catch (error: unknown) {
    console.error('Error creating address:', error);
    throw error;
  }
};

export const disableUserRepository = async (id: number) => {
  try {
    await prisma.users.update({
      where: { id: id },
      data: {
        active: false
      }
    });
  } catch (error: unknown) {
    console.error('Error creating address:', error);
    throw error;
  }
};

export const activeUserRepository = async (id: number) => {
  try {
    await prisma.users.update({
      where: { id: id },
      data: {
        active: true
      }
    });
  } catch (error: unknown) {
    console.error('Error creating address:', error);
    throw error;
  }
};
