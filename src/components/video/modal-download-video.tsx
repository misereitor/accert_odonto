import { Posts } from '@/model/post-model';
import { Button, LinearProgress } from '@mui/material';
import axios, { AxiosProgressEvent } from 'axios';
import { Dispatch, SetStateAction, useState } from 'react';
import { BiCloudDownload } from 'react-icons/bi';

type Props = {
  videoSelected: Posts | null;
  setVideoSelected: Dispatch<SetStateAction<Posts | null>>;
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
          <div className="w-full flex flex-col md:h-[80vh] md:w-[47vw]">
            <div className="md:flex justify-center">
              <div>
                <video
                  className="md:w-1/2 md:max-h-[70vh] rounded-xl"
                  src={videoSelected.url}
                  controls
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div className="md:w-1/3 md:ml-10">
                <div>
                  <h2>{videoSelected.name}</h2>
                </div>
                <div>
                  <span>{videoSelected.description}</span>
                </div>
              </div>
            </div>
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
