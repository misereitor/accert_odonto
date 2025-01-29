import { Box, Button, TextField } from '@mui/material';
import { Dispatch, SetStateAction, useState } from 'react';
import { PlayCircle } from '@mui/icons-material';
import Image from 'next/image';

type Props = {
  setTypeSing: Dispatch<SetStateAction<number>>;
};

export default function RecoveryPassword({ setTypeSing }: Props) {
  const [loading, setLoading] = useState(false);
  const handleLogin = async () => {
    setLoading(true);
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
          <h2>Recupere sua conta</h2>
        </div>
        <div className="w-full flex flex-col">
          <TextField
            id="outlined-basic"
            label="E-mail"
            variant="outlined"
            sx={{
              marginBottom: 2
            }}
          />
        </div>
        <div className="flex justify-end w-full"></div>
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
            Recuperar
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
            Entrar na sua conta
          </Button>
        </div>
      </Box>
    </div>
  );
}
