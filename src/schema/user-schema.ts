import { z } from 'zod';
import { validePassword } from '../../util/check-password';

export const schemaCreateUser = z
  .object({
    email: z.string().email('Insira um e-mail válido'),
    password: z
      .string()
      .min(8, 'A senha tem que ter ao menos 8 caracteres')
      .superRefine((val, ctx) => validePassword(val, ctx)),
    confirmpassword: z.string(),
    name: z
      .string()
      .min(3, { message: 'O seu nome deve ter mais de três letras' })
  })
  .refine((data) => data.password === data.confirmpassword, {
    path: ['confirmpassword'],
    message: 'As senhas não conferem'
  });

export const schemaEditUser = z.object({
  name: z.string(),
  email: z.string().email(),
  address: z.string().nullable(),
  facebook: z.string().nullable(),
  instagram: z.string().nullable(),
  whatsapp: z.string().nullable(),
  telephone: z.string().nullable()
});

export type FormCreateUser = z.infer<typeof schemaCreateUser>;
export type FormEditUser = z.infer<typeof schemaEditUser>;
