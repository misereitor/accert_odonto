import { Box, Button, TextField } from '@mui/material';
import { Dispatch, FormEvent, SetStateAction, useState } from 'react';
import { PlayCircle } from '@mui/icons-material';
import Image from 'next/image';
import { loginUserService } from '@/service/user-service';

type Props = {
  setTypeSing: Dispatch<SetStateAction<number>>;
};

export default function SingIn({ setTypeSing }: Props) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const userLogin = await loginUserService(email, password);
    if (!userLogin.success && userLogin.message) {
      setError(userLogin.message);
      setLoading(false);
      return;
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <Box
        component="form"
        autoComplete="off"
        noValidate
        onSubmit={handleLogin}
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
          <h2>Faça login na sua conta</h2>
        </div>
        <div className="w-full flex flex-col">
          <TextField
            id="outlined-basic"
            label="E-mail"
            variant="outlined"
            value={email}
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              marginBottom: 2
            }}
          />
          <TextField
            id="outlined-basic"
            label="Senha"
            value={password}
            error={!!error}
            helperText={error}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
            type="password"
          />
        </div>
        <div className="flex justify-end w-full">
          <Button
            variant="text"
            disabled={loading}
            onClick={() => setTypeSing(2)}
            sx={{
              textTransform: 'none'
            }}
          >
            Recuperar sua senha?
          </Button>
        </div>
        <div className="flex items-center justify-center flex-col w-80 mx-auto mt-2">
          <Button
            type="submit"
            color="primary"
            loading={loading}
            loadingPosition="center"
            endIcon={<PlayCircle />}
            variant="contained"
            sx={{
              width: 150,
              textTransform: 'none'
            }}
          >
            Entrar
          </Button>
          <Button
            variant="text"
            disabled={loading}
            onClick={() => setTypeSing(1)}
            sx={{
              marginTop: 1,
              textTransform: 'none'
            }}
          >
            Crie sua conta
          </Button>
        </div>
      </Box>
    </div>
  );
}
