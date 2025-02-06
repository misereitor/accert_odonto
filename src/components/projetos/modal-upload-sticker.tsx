'use client';

import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import RegisterImage from './register-image';
import { SquaresMeasure } from '@/model/post-model';
import Image from 'next/image';
import { Button } from '@mui/material';

type Props = {
  file: File | undefined;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
};

export default function ModalUploadSticker({ file, setOpenModal }: Props) {
  const [stage, setStage] = useState(0);
  const [urlImage, setUrlImage] = useState('');
  const [sizeImage, setSizeImage] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const rects: SquaresMeasure[] = [];

  useEffect(() => {
    const handleFile = () => {
      if (!file) return;
      const imgUrl = URL.createObjectURL(file);
      setUrlImage(imgUrl);
      const img = new window.Image();
      img.src = imgUrl;
      img.onload = () => {
        setSizeImage({
          width: img.width,
          height: img.height
        });
      };
    };
    handleFile();
  }, [file]);

  return (
    <div className="overflow-y-auto overflow-x-hidden">
      {stage == 0 && (
        <div>
          <div className="flex justify-end">
            <Button
              variant="contained"
              color="primary"
              onClick={() => setStage(1)}
            >
              Próximo
            </Button>
          </div>
          <div>
            {urlImage !== '' && (
              <Image
                src={urlImage}
                alt="Sticker"
                width={100}
                height={100}
                className="w-auto h-auto"
              />
            )}
          </div>
        </div>
      )}
      {stage == 1 && (
        <RegisterImage
          sizeImage={sizeImage}
          rects={rects}
          file={file}
          setStage={setStage}
          setOpenModal={setOpenModal}
        />
      )}
    </div>
  );
}
