import { Button } from '@mui/material';
import {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useState
} from 'react';
import { resizeImage } from '../../../util/resize-image-proportionally';

type Props = {
  setStage: Dispatch<SetStateAction<number>>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  containerRef: RefObject<HTMLDivElement | null>;
  imageRef: RefObject<HTMLImageElement | null>;
  file: File | undefined;
  setScalePercentage: Dispatch<SetStateAction<number>>;
  setRect: Dispatch<
    SetStateAction<{
      x: number;
      y: number;
      width: number;
      height: number;
    } | null>
  >;
  rect: {
    x: number;
    y: number;
    width: number;
    height: number;
  } | null;
  setSizeImage: Dispatch<
    SetStateAction<{
      width: number;
      height: number;
    } | null>
  >;
};

export default function ShowCanvas({
  canvasRef,
  containerRef,
  imageRef,
  rect,
  setRect,
  setStage,
  file,
  setScalePercentage,
  setSizeImage
}: Props) {
  const [isMarking, setIsMarking] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState<null | string>(null);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleFileShowCanva = async (file: File) => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.offsetWidth;
      const { imageResize, sizeImageResize, sizeImage } = await resizeImage(
        file,
        containerWidth
      );
      if (!imageResize || !sizeImageResize || !sizeImage) return;
      setSizeImage(sizeImage);
      setScalePercentage(sizeImageResize.scalePercentage);
      const imageUrl = URL.createObjectURL(imageResize);
      const img = new window.Image();
      img.src = imageUrl;
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = sizeImageResize.width;
        canvas.height = sizeImageResize.height;
        imageRef.current = img;
        ctx.drawImage(img, 0, 0);
      };
    };
    if (file) handleFileShowCanva(file);
  }, [
    canvasRef,
    containerRef,
    file,
    imageRef,
    setScalePercentage,
    setSizeImage
  ]);

  const drawRectangle = () => {
    const canvas = canvasRef.current;
    if (!canvas || !rect || !imageRef.current) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(imageRef.current, 0, 0);

    if (rect) {
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 2;
      ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
    }
  };

  const detectResizeArea = (offsetX: number, offsetY: number) => {
    if (!rect) return null;
    const margin = 10;
    const right =
      offsetX > rect.x + rect.width - margin && offsetX < rect.x + rect.width;
    const left = offsetX > rect.x && offsetX < rect.x + margin;
    const top = offsetY > rect.y && offsetY < rect.y + margin;
    const bottom =
      offsetY > rect.y + rect.height - margin && offsetY < rect.y + rect.height;

    if (top && left) return 'top-left';
    if (top && right) return 'top-right';
    if (bottom && left) return 'bottom-left';
    if (bottom && right) return 'bottom-right';
    if (left) return 'left';
    if (right) return 'right';
    if (top) return 'top';
    if (bottom) return 'bottom';

    return null;
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = event.nativeEvent;

    if (isMarking) {
      setRect({ x: offsetX, y: offsetY, width: 0, height: 0 });
      setDragging(true);
      setStartPos({ x: offsetX, y: offsetY });
      return;
    }

    if (!rect) return;

    const area = detectResizeArea(offsetX, offsetY);
    if (area) {
      setResizing(area);
      setStartPos({ x: offsetX, y: offsetY });
      return;
    }

    const isInsideRect =
      offsetX > rect.x &&
      offsetX < rect.x + rect.width &&
      offsetY > rect.y &&
      offsetY < rect.y + rect.height;

    if (isInsideRect) {
      setDragging(true);
      setStartPos({ x: offsetX - rect.x, y: offsetY - rect.y });
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!rect) return;

    const { offsetX, offsetY } = event.nativeEvent;

    if (resizing) {
      setRect((prev) => {
        if (!prev) return prev;

        const newRect = { ...prev };

        switch (resizing) {
          case 'right':
            newRect.width = Math.max(10, offsetX - prev.x);
            break;
          case 'left':
            newRect.width = Math.max(10, prev.x + prev.width - offsetX);
            newRect.x = offsetX;
            break;
          case 'bottom':
            newRect.height = Math.max(10, offsetY - prev.y);
            break;
          case 'top':
            newRect.height = Math.max(10, prev.y + prev.height - offsetY);
            newRect.y = offsetY;
            break;
          case 'top-left':
            newRect.width = Math.max(20, prev.x + prev.width - offsetX);
            newRect.height = Math.max(20, prev.y + prev.height - offsetY);
            newRect.x = offsetX;
            newRect.y = offsetY;
            break;
          case 'top-right':
            newRect.width = Math.max(20, offsetX - prev.x);
            newRect.height = Math.max(20, prev.y + prev.height - offsetY);
            newRect.y = offsetY;
            break;
          case 'bottom-left':
            newRect.width = Math.max(20, prev.x + prev.width - offsetX);
            newRect.height = Math.max(20, offsetY - prev.y);
            newRect.x = offsetX;
            break;
          case 'bottom-right':
            newRect.width = Math.max(20, offsetX - prev.x);
            newRect.height = Math.max(20, offsetY - prev.y);
            break;
        }

        return newRect;
      });
    } else if (dragging && !isMarking) {
      setRect((prev) =>
        prev
          ? {
              ...prev,
              x: Math.max(
                0,
                Math.min(
                  offsetX - startPos.x,
                  canvasRef.current!.width - prev.width
                )
              ),
              y: Math.max(
                0,
                Math.min(
                  offsetY - startPos.y,
                  canvasRef.current!.height - prev.height
                )
              )
            }
          : prev
      );
    } else if (isMarking && dragging) {
      setRect((prev) =>
        prev
          ? {
              ...prev,
              width: Math.max(
                10,
                Math.min(
                  offsetX - startPos.x,
                  canvasRef.current!.width - startPos.x
                )
              ),
              height: Math.max(
                10,
                Math.min(
                  offsetY - startPos.y,
                  canvasRef.current!.height - startPos.y
                )
              )
            }
          : prev
      );
    }

    const cursorStyles: Record<string, string> = {
      'top-left': 'nwse-resize',
      'top-right': 'nesw-resize',
      'bottom-left': 'nesw-resize',
      'bottom-right': 'nwse-resize',
      left: 'ew-resize',
      right: 'ew-resize',
      top: 'ns-resize',
      bottom: 'ns-resize'
    };

    const area = detectResizeArea(offsetX, offsetY);
    canvasRef.current!.style.cursor = area
      ? cursorStyles[area]
      : dragging
        ? 'move'
        : 'default';

    drawRectangle();
  };

  const handleMouseUp = () => {
    if (isMarking) {
      setIsMarking(false);
    }
    setDragging(false);
    setResizing(null);
  };

  const handleStartMarking = () => {
    setIsMarking(true);
    setRect(null);
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isMarking || rect) return;

    const { offsetX, offsetY } = event.nativeEvent;
    setRect({ x: offsetX, y: offsetY, width: 50, height: 50 });
  };
  return (
    <div>
      <div className="flex justify-between my-2">
        {!rect ? (
          <Button
            type="button"
            variant="contained"
            color="primary"
            onClick={handleStartMarking}
          >
            Marcar Área
          </Button>
        ) : (
          <div />
        )}
        <Button
          variant="contained"
          color="primary"
          type="button"
          onClick={() => setStage(1)}
        >
          próximo
        </Button>
      </div>
      <div className="w-full flex items-end justify-center" ref={containerRef}>
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onClick={handleCanvasClick}
        />
      </div>
    </div>
  );
}
