import { Dispatch, SetStateAction, useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import { PlayCircle } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import { FormCreateUser, schemaCreateUser } from '@/schema/user-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { createUserService } from '@/service/user-service';

type Props = {
  setTypeSing: Dispatch<SetStateAction<number>>;
};

export default function SingUp({ setTypeSing }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormCreateUser>({
    mode: 'all',
    criteriaMode: 'all',
    resolver: zodResolver(schemaCreateUser),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmpassword: ''
    }
  });

  const handleLogin = async (data: FormCreateUser) => {
    setLoading(true);
    setError(null);

    const createUser = await createUserService(data);
    if (!createUser.success) {
      setError(createUser.message);
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit(handleLogin)}
        autoComplete="off"
        sx={{
          width: 380,
          borderRadius: 3,
          padding: 2,
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'var(--body)',
          boxShadow: '0 0 20px rgba(0, 0, 0, 0.2)'
        }}
      >
        <div className="mx-auto mb-10">
          <Image src={'/logo.png'} width={200} height={60.3} alt="Logo" />
        </div>
        <div>
          <h2>Crie a sua conta</h2>
        </div>
        <div className="w-full flex flex-col">
          <TextField
            id="outlined-basic"
            label="Seu nome"
            variant="outlined"
            {...register('name')}
            error={!!errors.name?.message}
            helperText={errors.name?.message}
            sx={{
              marginBottom: 2
            }}
          />
          <TextField
            id="outlined-basic"
            label="E-mail"
            variant="outlined"
            error={!!errors.email?.message}
            helperText={errors.email?.message}
            {...register('email')}
            sx={{
              marginBottom: 2
            }}
          />
          <TextField
            id="outlined-basic"
            label="Senha"
            type="password"
            variant="outlined"
            error={!!errors.password?.message}
            helperText={errors.password?.message}
            {...register('password')}
            sx={{
              marginBottom: 2
            }}
          />
          <TextField
            type="password"
            id="outlined-basic"
            label="Confirme sua senha"
            error={!!errors.confirmpassword?.message}
            helperText={errors.confirmpassword?.message}
            {...register('confirmpassword')}
            variant="outlined"
          />
        </div>
        {error && (
          <div>
            <span className="text-[#D32F2F] font-normal text-xs tracking-[0.03333em]">
              {error}
            </span>
          </div>
        )}
        <div className="flex items-center justify-center flex-col w-80 mx-auto mt-5">
          <Button
            type="submit"
            color="primary"
            loading={loading}
            loadingPosition="center"
            endIcon={<PlayCircle />}
            variant="contained"
            sx={{
              width: 180,
              textTransform: 'none'
            }}
          >
            Crie sua conta
          </Button>
          <Button
            variant="text"
            disabled={loading}
            onClick={() => setTypeSing(0)}
            sx={{
              marginTop: 1,
              textTransform: 'none'
            }}
          >
            Faça login em vez disso
          </Button>
        </div>
      </Box>
    </div>
  );
}
