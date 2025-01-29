'use server';
import { users } from '@prisma/client';
import {
  createUserRepository,
  getUserByEmailRepository
} from '../repository/user-repository';
import { FormCreateUser } from '@/schema/user-schema';
import * as bcrypt from 'bcrypt';
import * as jose from 'jose';
import { LoginUser } from '@/model/loginModel';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const { SECRET_KEY } = process.env;

export const createUserService = async (userForm: FormCreateUser) => {
  const userInDb = await getUserByEmailRepository(userForm.email.toLowerCase());
  if (userInDb) {
    return {
      success: false,
      message: 'E-mail já pertence a outro usuário!'
    } as LoginUser;
  }
  const hashPassword = await bcrypt.hash(userForm.password, 10);
  const user: users = {
    type: 1,
    id: 0,
    active: true,
    email: userForm.email.toLowerCase(),
    password: hashPassword,
    name: userForm.name,
    email_confirmed: false
  };
  const createUser = await createUserRepository(user);
  createUser.password = '';
  await createTokenAdnCookies(createUser);
  redirect('/app/home');
};

export const loginUserService = async (email: string, password: string) => {
  const userInDb = await getUserByEmailRepository(email.toLowerCase());
  if (!userInDb)
    return {
      success: false,
      message: 'Login e/ou senha inválidos'
    } as LoginUser;
  const isPassword = await bcrypt.compare(password, userInDb.password);
  if (!isPassword) {
    return {
      success: false,
      message: 'Login e/ou senha inválidos'
    } as LoginUser;
  }
  userInDb.password = '';
  await createTokenAdnCookies(userInDb);
  redirect('/app/home');
};

export const getUserByToken = async () => {
  try {
    const coockieStore = await cookies();
    const token = coockieStore.get('token');
    if (!token) redirect('/');
    if (!SECRET_KEY) throw new Error('Falha interna');

    const jwtKey = jose.base64url.decode(SECRET_KEY);

    const { payload } = await jose.jwtVerify(token.value, jwtKey, {
      algorithms: ['HS256']
    });
    return payload.user as users;
  } catch (error: unknown) {
    console.error('Falha ao decodificar o token', error);
    throw error;
  }
};

const createTokenAdnCookies = async (user: users) => {
  const coockieStore = await cookies();
  const token = await createTokenService(user);
  coockieStore.set('token', token, { httpOnly: true });
};

const createTokenService = async (user: users) => {
  try {
    if (!SECRET_KEY) throw new Error('Falha interna');
    const jwtKey = jose.base64url.decode(SECRET_KEY);
    const time = new Date();
    const token = await new jose.SignJWT({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        email_confirmed: user.email_confirmed,
        type: user.type
      },
      time
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7D')
      .sign(jwtKey);
    return token;
  } catch (error: unknown) {
    console.error('Falha na criação do token', error);
    throw error;
  }
};
