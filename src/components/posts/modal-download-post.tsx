import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent
} from '@mui/material';
import { logos, posts } from '@prisma/client';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import {
  generateAndDownloadImage,
  resizeImageByFileUrl,
  scaleRectangleToSmallerImage
} from '../../../util/resize-image-proportionally';

type Props = {
  postSelect: posts | null;
  setPostSelect: Dispatch<SetStateAction<posts | null>>;
  logos: logos[];
};

export default function ModalDownloadPost({ postSelect, logos }: Props) {
  const [logoSelected, setLogoSelected] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scalePercentage, setScalePercentage] = useState(100);
  const [logo, setLogo] = useState<logos | null>(null);

  useEffect(() => {
    const handleFileShowCanva = async () => {
      if (!postSelect || !postSelect.url) return;
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;

      // Redimensiona a imagem com base na largura do container
      const { imageResize, sizeImageResize, sizeImage } =
        await resizeImageByFileUrl(postSelect.url, containerWidth);

      if (!imageResize || !sizeImageResize || !sizeImage) return;

      setScalePercentage(sizeImageResize.scalePercentage);

      // Agora carregamos a imagem redimensionada usando o Blob gerado
      const imageUrl = URL.createObjectURL(imageResize);
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      img.src = imageUrl;

      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Definimos o tamanho do canvas para o tamanho da imagem redimensionada
        canvas.width = sizeImageResize.width;
        canvas.height = sizeImageResize.height;

        imageRef.current = img;
        ctx.drawImage(img, 0, 0, sizeImageResize.width, sizeImageResize.height);

        // Liberar a URL do objeto após o uso para evitar vazamento de memória
        URL.revokeObjectURL(imageUrl);
      };

      img.onerror = (err) => {
        console.error('Erro ao carregar a imagem:', err);
      };
    };

    handleFileShowCanva();
  }, [canvasRef, containerRef, postSelect]);

  const handleChange = (event: SelectChangeEvent) => {
    const selectedLogoId = event.target.value as string;
    setLogoSelected(selectedLogoId);

    const selectedLogo = logos.find(
      (logo) => logo.id === Number(selectedLogoId)
    );
    if (selectedLogo) {
      setLogo(selectedLogo);
      drawLogoOnCanvas(selectedLogo);
    }
  };

  const drawLogoOnCanvas = (logo: logos) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (!canvas || !ctx || !postSelect || !logo.url) return;

    const scale = scaleRectangleToSmallerImage(
      postSelect.square_x,
      postSelect.square_y,
      postSelect.square_width,
      postSelect.square_height,
      scalePercentage
    );

    const logoImg = new Image();
    logoImg.crossOrigin = 'anonymous';
    logoImg.src = logo.url;

    logoImg.onload = () => {
      if (imageRef.current) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(imageRef.current, 0, 0, canvas.width, canvas.height);
      }

      // Mantendo a proporção da logo
      const aspectRatio = logoImg.width / logoImg.height;
      let logoWidth = scale.width;
      let logoHeight = scale.height;

      if (logoWidth / logoHeight > aspectRatio) {
        // A largura está desproporcional, ajustar com base na altura
        logoWidth = logoHeight * aspectRatio;
      } else {
        // A altura está desproporcional, ajustar com base na largura
        logoHeight = logoWidth / aspectRatio;
      }

      // Centraliza a logo dentro do espaço disponível
      const offsetX = scale.x + (scale.width - logoWidth) / 2;
      const offsetY = scale.y + (scale.height - logoHeight) / 2;

      ctx.drawImage(logoImg, offsetX, offsetY, logoWidth, logoHeight);
    };

    logoImg.onerror = (err) => {
      console.error('Erro ao carregar a logo:', err);
    };
  };

  const handleDownload = async () => {
    if (!postSelect) return;
    await generateAndDownloadImage(postSelect, logo);
  };

  return (
    <div>
      <div ref={containerRef}>
        <canvas ref={canvasRef} />
      </div>
      <div className="mt-10">
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Age</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={logoSelected}
            label="Sua Logo"
            onChange={handleChange}
          >
            {logos.map((logo) => (
              <MenuItem value={logo.id} key={logo.id}>
                {logo.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div>
        <Button
          variant="contained"
          color="primary"
          onClick={handleDownload}
          style={{ marginTop: '20px' }}
        >
          Baixar Imagem
        </Button>
      </div>
    </div>
  );
}
