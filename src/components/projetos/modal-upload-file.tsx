'use client';

import { Dispatch, SetStateAction, useRef, useState } from 'react';
import ShowCanvas from './show-canvas';
import RegisterImage from './register-image';

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

  return (
    <div>
      {stage == 0 && (
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
