import {
  generateSignedDownloadUrls,
  generateSignedUrl
} from '@/service/files-service';
import { createLogoService } from '@/service/logo-service';
import { getUserByToken } from '@/service/user-service';
import { Button, TextField } from '@mui/material';
import { logos } from '@prisma/client';
import axios from 'axios';
import Image from 'next/image';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

type Props = {
  file: File | undefined;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
};

export default function ModalInsertLogo({ file, setOpenModal }: Props) {
  const [imageUrl, setImageUrl] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const createImageUrl = () => {
      if (!file) return;
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    };
    createImageUrl();
  }, [file]);

  const handleSalveLogo = async () => {
    if (!file) return;
    const now = new Date();
    const nowPlusOneDay = new Date(now.getTime() + 60 * 60 * 24000);
    const user = await getUserByToken();
    setError('');
    if (name === '') {
      setError('Adicione um nome para a sua logo');
      return;
    }

    const logo: logos = {
      name,
      id: 0,
      user_id: user.id,
      path: '',
      name_unique: '',
      url: null,
      timestampUrl: nowPlusOneDay
    };

    try {
      const urlOracle = await generateSignedUrl(
        file.name.split('.')[file.name.split('.').length - 1]
      );
      const response = await axios.put(urlOracle.signedUrl, file, {
        headers: {
          'Content-Type': file.type
        }
      });
      if (response.status === 200) {
        logo.url = await generateSignedDownloadUrls(urlOracle.filePath.path);
        logo.path = urlOracle.filePath.path;
        logo.name_unique = urlOracle.filePath.fileNameRandon;
        await createLogoService(logo);
        setOpenModal(false);
      }
    } catch (error: unknown) {
      console.error('Falha al savlar a imagem', error);
    }
  };
  return (
    <div>
      <div className="flex justify-center">
        {imageUrl && (
          <Image src={imageUrl} alt="logo" width={350} height={350} />
        )}
      </div>
      <div className="w-full mt-5 flex justify-center">
        <TextField
          id="outlined-basic"
          label="Nome"
          variant="outlined"
          value={name}
          error={error != ''}
          helperText={error}
          type="text"
          onChange={(e) => setName(e.target.value)}
          sx={{
            width: 350
          }}
        />
      </div>
      <div className="flex justify-between w-[350px] mx-auto mt-5">
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          onClick={() => setOpenModal(false)}
        >
          Cancelar
        </Button>
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          onClick={handleSalveLogo}
        >
          Salvar
        </Button>
      </div>
    </div>
  );
}
