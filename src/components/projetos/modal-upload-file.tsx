'use client';

import { Dispatch, SetStateAction, useRef, useState } from 'react';
import ShowCanvas from './show-canvas';
import RegisterImage from './register-image';
import ShowVideo from './show-video';

type Props = {
  file: File | undefined;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
};

export default function ModalUploadFile({ file, setOpenModal }: Props) {
  const [stage, setStage] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scalePercentage, setScalePercentage] = useState(100);
  const [sizeImage, setSizeImage] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [rect, setRect] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  const mediaType = file?.type.split('/')[0] === 'image' ? true : false;

  return (
    <div>
      {stage == 0 && (
        <div>
          {mediaType ? (
            <ShowCanvas
              setScalePercentage={setScalePercentage}
              file={file}
              setSizeImage={setSizeImage}
              rect={rect}
              setStage={setStage}
              setRect={setRect}
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
          setOpenModal={setOpenModal}
          file={file}
          sizeImage={sizeImage}
          scalePercentage={scalePercentage}
          rect={rect}
          setStage={setStage}
        />
      )}
    </div>
  );
}
