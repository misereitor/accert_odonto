'use client';

import { Dispatch, SetStateAction, useRef, useState } from 'react';
import ShowCanvas from './show-canvas';
import RegisterImage from './register-image';
import ShowVideo from './show-video';
import { SquaresMeasure } from '@/model/post-model';

type Props = {
  file: File | undefined;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
};

export default function ModalUploadFile({ file, setOpenModal }: Props) {
  const [stage, setStage] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [sizeImage, setSizeImage] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [rects, setRects] = useState<SquaresMeasure[]>([]);

  const mediaType = file?.type.split('/')[0] === 'image' ? true : false;

  return (
    <div className="overflow-y-auto overflow-x-hidden">
      {stage == 0 && (
        <div>
          {mediaType ? (
            <ShowCanvas
              rects={rects}
              setRects={setRects}
              file={file}
              setSizeImage={setSizeImage}
              setStage={setStage}
              imageRef={imageRef}
              canvasRef={canvasRef}
              containerRef={containerRef}
            />
          ) : (
            <ShowVideo
              setSizeImage={setSizeImage}
              setStage={setStage}
              file={file}
            />
          )}
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
