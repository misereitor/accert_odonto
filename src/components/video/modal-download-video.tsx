import { Button, LinearProgress } from '@mui/material';
import { posts } from '@prisma/client';
import axios, { AxiosProgressEvent } from 'axios';
import { Dispatch, SetStateAction, useState } from 'react';
import { BiCloudDownload } from 'react-icons/bi';

type Props = {
  videoSelected: posts | null;
  setVideoSelected: Dispatch<SetStateAction<posts | null>>;
};

export default function ModalDownloadVideo({ videoSelected }: Props) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleProgressUpload = (progressEvent: AxiosProgressEvent) => {
    if (!videoSelected) return;
    const total = progressEvent.total ?? videoSelected.size;
    const percentCompleted = Math.round((progressEvent.loaded * 100) / total);
    setProgress(percentCompleted);
  };

  const handleDownload = async () => {
    try {
      setLoading(true);
      if (!videoSelected || !videoSelected.url) return;

      const nameFile = `${videoSelected.name}.${videoSelected.name_unique.split('.')[videoSelected.name_unique.split('.').length - 1]}`;

      const response = await axios.get(videoSelected.url, {
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
    <div className="p-4">
      <div>
        {videoSelected && videoSelected.url && (
          <div>
            <video
              className="max-w-[500px] max-h-[500px]"
              src={videoSelected.url}
              controls
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div className="mt-5">
              <div className="my-4">
                {loading && (
                  <LinearProgress variant="determinate" value={progress} />
                )}
              </div>
            </div>
            <div className="w-full flex justify-end">
              <Button
                color="primary"
                onClick={handleDownload}
                loading={loading}
                loadingPosition="start"
                startIcon={<BiCloudDownload />}
                variant="contained"
              >
                Save
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
