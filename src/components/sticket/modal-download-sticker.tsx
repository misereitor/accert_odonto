import { Button, LinearProgress } from '@mui/material';

import { Posts } from '@/model/post-model';
import Image from 'next/image';
import { useState } from 'react';
import axios, { AxiosProgressEvent } from 'axios';

type Props = {
  postSelect: Posts | null;
};

export default function ModalDownloadSticker({ postSelect }: Props) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleProgressUpload = (progressEvent: AxiosProgressEvent) => {
    if (!postSelect) return;
    const total = progressEvent.total ?? postSelect.size;
    const percentCompleted = Math.round((progressEvent.loaded * 100) / total);
    setProgress(percentCompleted);
  };

  const handleDownload = async () => {
    if (!postSelect) return;
    try {
      setLoading(true);

      const nameFile = `${postSelect.name}.${postSelect.name_unique.split('.')[postSelect.name_unique.split('.').length - 1]}`;

      const response = await axios.get(postSelect.url, {
        onDownloadProgress: handleProgressUpload,
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(response.data);

      const link = document.createElement('a');
      link.href = url;
      link.download = nameFile;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao baixar o vídeo:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[500px]">
      <div className="flex items-center justify-center">
        {postSelect && (
          <Image
            src={postSelect?.url}
            alt={postSelect?.name}
            width={300}
            height={300}
          />
        )}
      </div>
      <div className="my-4">
        {loading && <LinearProgress variant="determinate" value={progress} />}
      </div>
      <div className="w-full flex justify-end">
        <Button
          variant="contained"
          color="primary"
          onClick={handleDownload}
          style={{ marginTop: '20px' }}
        >
          Baixar Sticker
        </Button>
      </div>
    </div>
  );
}
