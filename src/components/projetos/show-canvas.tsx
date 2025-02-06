import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent
} from '@mui/material';
import {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useState
} from 'react';
import { resizeImageByFile } from '../../../util/resize-image-proportionally';
import { SquaresMeasure } from '@/model/post-model';
import { IoCloseCircleOutline } from 'react-icons/io5';

type Props = {
  setStage: Dispatch<SetStateAction<number>>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  containerRef: RefObject<HTMLDivElement | null>;
  imageRef: RefObject<HTMLImageElement | null>;
  file: File | undefined;
  setRects: Dispatch<SetStateAction<SquaresMeasure[]>>;
  rects: SquaresMeasure[];
  setSizeImage: Dispatch<
    SetStateAction<{ width: number; height: number } | null>
  >;
};

export default function ShowCanvas({
  canvasRef,
  containerRef,
  imageRef,
  rects,
  setRects,
  setStage,
  file,
  setSizeImage
}: Props) {
  const [isMarking, setIsMarking] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState<null | string>(null);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [selectedRectId, setSelectedRectId] = useState<number | null>(null);
  const [scalePercentage, setScalePercentage] = useState(100);

  useEffect(() => {
    const handleFileShowCanva = async (file: File) => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;
      const { imageResize, sizeImageResize, sizeImage } =
        await resizeImageByFile(file, containerWidth);

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
  }, [canvasRef, containerRef, file, imageRef, setSizeImage]);

  useEffect(() => {
    drawRectangles(); // Desenha os retângulos toda vez que `rects` mudar
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rects]);

  const drawRectangles = () => {
    const canvas = canvasRef.current;
    if (!canvas || !imageRef.current) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(imageRef.current, 0, 0);

    rects.forEach((rect) => {
      ctx.strokeStyle = rect.type == 0 ? 'blue' : 'green';
      ctx.lineWidth = 2;
      ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);

      // Adiciona o texto indicando o tipo da área
      ctx.font = '14px Arial';
      ctx.fillStyle = rect.type == 0 ? 'blue' : 'green';
      ctx.fillText(
        rect.type == 0 ? 'Logo' : 'Informações',
        rect.x + 5,
        rect.y + 15
      );
    });
  };

  const detectResizeArea = (offsetX: number, offsetY: number) => {
    const clickedRect = rects.find((rect) => {
      return (
        offsetX > rect.x &&
        offsetX < rect.x + rect.width &&
        offsetY > rect.y &&
        offsetY < rect.y + rect.height
      );
    });
    if (rects.length === 0 || selectedRectId === null) return null;

    if (!clickedRect) return null;

    const { x, y, width, height } = clickedRect;
    const margin = 10;

    const right = offsetX > x + width - margin && offsetX < x + width;
    const left = offsetX > x && offsetX < x + margin;
    const top = offsetY > y && offsetY < y + margin;
    const bottom = offsetY > y + height - margin && offsetY < y + height;

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
    // Detecta se o clique está em um retângulo existente
    const clickedRect = rects.find((rect) => {
      return (
        offsetX > rect.x &&
        offsetX < rect.x + rect.width &&
        offsetY > rect.y &&
        offsetY < rect.y + rect.height
      );
    });

    if (clickedRect) {
      // Se o clique foi dentro de um retângulo, marca ele para mover ou redimensionar
      setSelectedRectId(clickedRect.id);

      // Detectando se estamos clicando em uma área de redimensionamento
      const area = detectResizeArea(offsetX, offsetY);
      if (area) {
        setResizing(area); // Inicia o redimensionamento
        setStartPos({ x: offsetX, y: offsetY });
        return;
      }

      // Caso não esteja clicando em uma área de redimensionamento, move o retângulo
      setDragging(true);
      setStartPos({
        x: offsetX - clickedRect.x,
        y: offsetY - clickedRect.y
      });
      const selectedRect = rects.find((rect) => rect.id === selectedRectId);
      if (!selectedRect) return;
      const isInsideRect =
        offsetX > selectedRect.x &&
        offsetX < selectedRect.x + selectedRect.width &&
        offsetY > selectedRect.y &&
        offsetY < selectedRect.y + selectedRect.height;

      if (isInsideRect) {
        setDragging(true); // Inicia o arrasto do retângulo
        setStartPos({
          x: offsetX - selectedRect.x,
          y: offsetY - selectedRect.y
        });
      }
    } else {
      // Caso não tenha clicado em nenhum retângulo, pode começar a desenhar um novo
      if (isMarking) {
        const newRect: SquaresMeasure = {
          id: Date.now(), // Gerando um ID único para cada retângulo
          x: offsetX,
          y: offsetY,
          width: 0,
          height: 0,
          scalePercentage: scalePercentage,
          type: 0 // Usando o tipo selecionado
        };
        setRects((prev) => [...prev, newRect]); // Adiciona o novo retângulo à lista
        setDragging(true);
        setStartPos({ x: offsetX, y: offsetY });
        setSelectedRectId(newRect.id); // Seleciona o novo retângulo
      }
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isMarking && selectedRectId === null) return; // Só permite mover ou redimensionar se não estiver marcando ou tiver um retângulo selecionado.

    const { offsetX, offsetY } = event.nativeEvent;

    setRects((prevRects) => {
      const updatedRects = prevRects.map((rect) => {
        if (rect.id === selectedRectId) {
          if (resizing) {
            // Se estamos redimensionando
            const newRect = { ...rect };

            switch (resizing) {
              case 'right':
                newRect.width = Math.max(10, offsetX - rect.x); // Garantir largura mínima
                break;
              case 'left':
                newRect.width = Math.max(10, rect.x + rect.width - offsetX);
                newRect.x = offsetX; // Mover o lado esquerdo
                break;
              case 'bottom':
                newRect.height = Math.max(10, offsetY - rect.y); // Garantir altura mínima
                break;
              case 'top':
                newRect.height = Math.max(10, rect.y + rect.height - offsetY);
                newRect.y = offsetY; // Mover o lado superior
                break;
              case 'top-left':
                newRect.width = Math.max(10, rect.x + rect.width - offsetX);
                newRect.height = Math.max(10, rect.y + rect.height - offsetY);
                newRect.x = offsetX;
                newRect.y = offsetY;
                break;
              case 'top-right':
                newRect.width = Math.max(10, offsetX - rect.x);
                newRect.height = Math.max(10, rect.y + rect.height - offsetY);
                newRect.y = offsetY;
                break;
              case 'bottom-left':
                newRect.width = Math.max(10, rect.x + rect.width - offsetX);
                newRect.height = Math.max(10, offsetY - rect.y);
                newRect.x = offsetX;
                break;
              case 'bottom-right':
                newRect.width = Math.max(10, offsetX - rect.x);
                newRect.height = Math.max(10, offsetY - rect.y);
                break;
            }

            return newRect;
          } else if (dragging && !isMarking) {
            // Se estamos movendo a área
            return {
              ...rect,
              x: Math.max(
                0,
                Math.min(
                  offsetX - startPos.x,
                  canvasRef.current!.width - rect.width
                )
              ),
              y: Math.max(
                0,
                Math.min(
                  offsetY - startPos.y,
                  canvasRef.current!.height - rect.height
                )
              )
            };
          } else if (isMarking && dragging) {
            return {
              ...rect,
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
            };
          }
        }

        return rect; // Não faz nada com os outros retângulos
      });

      return updatedRects;
    });

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

    drawRectangles(); // Redesenha os retângulos atualizados
  };

  const handleMouseUp = () => {
    if (isMarking) {
      setIsMarking(false);
    }
    setDragging(false);
    setResizing(null);
  };

  const handleChangeType = (
    e: SelectChangeEvent<number>,
    rect: SquaresMeasure
  ) => {
    const newType = e.target.value as number;
    setRects((prevRects) =>
      prevRects.map((r) => (r.id === rect.id ? { ...r, type: newType } : r))
    );
  };

  const handleRemoveSquare = (rect: SquaresMeasure) => {
    setRects((prevRects) => prevRects.filter((r) => r.id !== rect.id));
  };

  return (
    <div className="w-[700px] h-[700px]">
      <div className="flex justify-between my-2">
        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsMarking(true)}
        >
          Marcar Área
        </Button>
        <Button variant="contained" color="primary" onClick={() => setStage(1)}>
          Próximo
        </Button>
      </div>

      <div className="w-full flex items-end justify-center" ref={containerRef}>
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        />
      </div>

      <div className="mt-4">
        {rects.map((rect) => (
          <div key={rect.id} className="flex w-full ">
            <FormControl style={{ marginBottom: '10px', width: '100%' }}>
              <InputLabel>Tipo da Área</InputLabel>
              <Select
                value={rect.type}
                onChange={(e) => handleChangeType(e, rect)}
              >
                <MenuItem value="0">Logo</MenuItem>
                <MenuItem value="1">Information</MenuItem>
              </Select>
            </FormControl>
            <button type="button" onClick={() => handleRemoveSquare(rect)}>
              <IoCloseCircleOutline size={30} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
