import { z } from 'zod';

export const validePassword = (val: string, ctx: z.RefinementCtx) => {
  const regexNumber = !/\d/.test(val);
  const regexLetter = !/\D/.test(val);
  const regexCaracter = !/\W/.test(val);
  const regexUpperCase = !/[A-Z]/g.test(val);
  const regexLowerCase = !/[a-z]/g.test(val);
  if (regexNumber) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'A senha precisa ter um número',
      fatal: true
    });
  }
  if (regexLetter) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'A senha precisa ter uma letra',
      fatal: true
    });
  }
  if (regexCaracter) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'A senha precisa ter um caracter como @ !',
      fatal: true
    });
  }
  if (regexLowerCase) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'A senha precisa ter uma letra maiúscula',
      fatal: true
    });
  }
  if (regexUpperCase) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'A senha precisa ter uma letra minúscula',
      fatal: true
    });
  }
};
