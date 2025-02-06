import {
  generateSignedDownloadUrls,
  generateSignedUrl
} from '@/service/files-service';
import { createLogoService } from '@/service/logo-service';
import { getUserByToken } from '@/service/user-service';
import { Button, LinearProgress, TextField } from '@mui/material';
import { logos } from '@prisma/client';
import axios, { AxiosProgressEvent } from 'axios';
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
  const [isUpload, setIsUpload] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const createImageUrl = () => {
      if (!file) return;
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    };
    createImageUrl();
  }, [file]);

  const handleProgressUpload = (progressEvent: AxiosProgressEvent) => {
    if (!file) return;
    const total = progressEvent.total ?? file.size;
    const percentCompleted = Math.round((progressEvent.loaded * 100) / total);
    setProgress(percentCompleted);
  };

  const handleSalveLogo = async () => {
    if (!file) return;
    setError('');
    if (name === '') {
      setError('Adicione um nome para a sua logo');
      return;
    }
    setIsUpload(true);
    const now = new Date();
    const nowPlusOneDay = new Date(now.getTime() + 60 * 60 * 24000);
    const user = await getUserByToken();

    const img = new window.Image();
    img.src = imageUrl;
    const logo: logos = {
      width: 0,
      height: 0,
      name,
      id: 0,
      user_id: user.id,
      path: '',
      name_unique: '',
      url: '',
      timestampUrl: nowPlusOneDay
    };
    img.onload = () => {
      logo.width = img.width;
      logo.height = img.height;
    };

    try {
      const urlOracle = await generateSignedUrl(
        file.name.split('.')[file.name.split('.').length - 1]
      );
      const response = await axios.put(urlOracle.signedUrl, file, {
        headers: {
          'Content-Type': file.type
        },
        onUploadProgress: handleProgressUpload
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
    } finally {
      setIsUpload(false);
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
      <div className="mt-3">
        {isUpload && <LinearProgress variant="determinate" value={progress} />}
      </div>
      <div className="flex justify-between w-[350px] mx-auto mt-5">
        <Button
          component="label"
          loading={isUpload}
          loadingPosition="start"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          onClick={() => setOpenModal(false)}
        >
          Cancelar
        </Button>
        <Button
          loading={isUpload}
          loadingPosition="start"
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
