import { Button } from '@mui/material';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

type Props = {
  setStage: Dispatch<SetStateAction<number>>;
  file: File | undefined;
  setSizeImage: Dispatch<
    SetStateAction<{
      width: number;
      height: number;
    } | null>
  >;
};

export default function ShowVideo({ file, setStage, setSizeImage }: Props) {
  const [urlVideo, setUrlVideo] = useState('');

  useEffect(() => {
    if (file) {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.src = URL.createObjectURL(file);
      setUrlVideo(video.src);
      video.onloadedmetadata = () => {
        const width = video.videoWidth;
        const height = video.videoHeight;

        setSizeImage({ width, height });

        // Liberar memória após uso
        URL.revokeObjectURL(video.src);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  return (
    <div className="max-h-[600px] flex flex-col w-full">
      <div className="flex justify-end my-2 w-full">
        <Button
          variant="contained"
          color="primary"
          type="button"
          onClick={() => setStage(1)}
        >
          Próximo
        </Button>
      </div>

      <div className="flex justify-center items-center w-full max-h-[500px] overflow-hidden mt-2">
        {urlVideo !== '' && (
          <video
            src={urlVideo}
            controls
            style={{
              width: '100%',
              maxHeight: '500px',
              objectFit: 'contain',
              borderRadius: 8
            }}
          />
        )}
      </div>
    </div>
  );
}
