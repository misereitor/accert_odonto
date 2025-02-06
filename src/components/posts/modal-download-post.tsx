import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent
} from '@mui/material';
import { logos, squares, users } from '@prisma/client';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import {
  generateAndDownloadImage,
  resizeImageByFileUrl,
  scaleRectangleToSmallerImage
} from '../../../util/resize-image-proportionally';
import { ContentToInsert, Posts } from '@/model/post-model';
import { getUserByToken } from '@/service/user-service';
import { getUserByIdRepository } from '@/repository/user-repository';

type Props = {
  postSelect: Posts | null;
  setPostSelect: Dispatch<SetStateAction<Posts | null>>;
  logos: logos[];
};

type LogoSelection = {
  [squareId: number]: logos | null; // Armazena a logo selecionada para cada quadrado
};

export default function ModalDownloadPost({ postSelect, logos }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scalePercentage, setScalePercentage] = useState(100);
  const [logoSelections, setLogoSelections] = useState<LogoSelection>({});
  const [user, setUser] = useState<users | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const userToken = await getUserByToken();
      const user = await getUserByIdRepository(userToken.id);
      setUser(user);
    };
    getUser();
  }, []);

  useEffect(() => {
    if (!postSelect || !user) return;

    const redrawCanvas = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');

      if (!canvas || !ctx || !imageRef.current) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(imageRef.current, 0, 0, canvas.width, canvas.height);

      // Redesenha as logos selecionadas
      Object.entries(logoSelections).forEach(([id, selectedLogo]) => {
        if (selectedLogo) {
          const sq = postSelect.squares.find((s) => s.id === Number(id));
          if (sq) {
            const scaleSq = scaleRectangleToSmallerImage(
              sq.x,
              sq.y,
              sq.width,
              sq.height,
              scalePercentage
            );
            drawSingleLogo(ctx, selectedLogo, scaleSq);
          }
        }
      });

      // Redesenha as informações de texto
      postSelect.squares.forEach((sq) => {
        drawSingleInformations(ctx, sq);
      });
    };

    redrawCanvas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, postSelect, logoSelections]);

  // useEffect(() => {
  //   const redrawCanvas = () => {
  //     const canvas = canvasRef.current;
  //     const ctx = canvas?.getContext('2d');
  //     if (!canvas || !ctx || !postSelect || !imageRef.current) return;

  //     ctx.clearRect(0, 0, canvas.width, canvas.height);
  //     ctx.drawImage(imageRef.current, 0, 0, canvas.width, canvas.height);

  //     Object.entries(logoSelections).forEach(([id, selectedLogo]) => {
  //       if (selectedLogo) {
  //         const sq = postSelect.squares.find((s) => s.id === Number(id));
  //         if (sq) {
  //           const scaleSq = scaleRectangleToSmallerImage(
  //             sq.x,
  //             sq.y,
  //             sq.width,
  //             sq.height,
  //             scalePercentage
  //           );
  //           drawSingleLogo(ctx, selectedLogo, scaleSq);
  //         }
  //       }
  //     });
  //   };
  //   redrawCanvas();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [logoSelections]);

  useEffect(() => {
    const handleFileShowCanva = async () => {
      if (!postSelect || !postSelect.url) return;
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;

      const { imageResize, sizeImageResize, sizeImage } =
        await resizeImageByFileUrl(postSelect.url, containerWidth);

      if (!imageResize || !sizeImageResize || !sizeImage) return;

      setScalePercentage(sizeImageResize.scalePercentage);

      const imageUrl = URL.createObjectURL(imageResize);
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      img.src = imageUrl;

      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = sizeImageResize.width;
        canvas.height = sizeImageResize.height;

        imageRef.current = img;
        ctx.drawImage(img, 0, 0, sizeImageResize.width, sizeImageResize.height);
        URL.revokeObjectURL(imageUrl);
      };

      img.onerror = (err) => {
        console.error('Erro ao carregar a imagem:', err);
      };
    };

    handleFileShowCanva();
  }, [postSelect]);

  const handleLogoChange = (squareId: number, event: SelectChangeEvent) => {
    const selectedLogoId = event.target.value;
    const selectedLogo =
      logos.find((logo) => logo.id == Number(selectedLogoId)) || null;

    setLogoSelections((prev) => {
      const updatedSelections = { ...prev, [squareId]: selectedLogo };
      return updatedSelections;
    });
  };

  const drawSingleInformations = (
    ctx: CanvasRenderingContext2D,
    sq: squares
  ) => {
    if (sq.type !== 1) return;
    const SquareScale = scaleRectangleToSmallerImage(
      sq.x,
      sq.y,
      sq.width,
      sq.height,
      scalePercentage
    );
    const text = `
  ${user?.address ? user.address : 'Rua Exemplo, 123'}
  ${user?.telephone ? user.telephone : '(11) 99999-9999'}
  `.trim();
    if (!text) return;
    console.log('Texto desenhado:', text);

    const fontSize = Math.max(SquareScale.height * 0.2, 12); // Fonte proporcional ao quadrado, mínimo 12px
    ctx.font = `${fontSize}px Arial`;
    ctx.fillStyle = 'red'; // Teste com uma cor visível
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Definição de posição
    const maxWidth = SquareScale.width * 0.9; // Margem para evitar corte
    const lineHeight = fontSize * 1.2;
    const words = text.split(' ');
    let line = '';
    let y = SquareScale.y + lineHeight / 2;

    for (const word of words) {
      const testLine = line + word + ' ';
      const testWidth = ctx.measureText(testLine).width;

      if (testWidth > maxWidth && line !== '') {
        ctx.fillText(line, SquareScale.x + SquareScale.width / 2, y);
        line = word + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }

    ctx.fillText(line, SquareScale.x + SquareScale.width / 2, y); // Última linha
  };

  const drawSingleLogo = (
    ctx: CanvasRenderingContext2D,
    logo: logos,
    square: { x: number; y: number; width: number; height: number }
  ) => {
    const logoImg = new Image();
    logoImg.crossOrigin = 'anonymous';
    logoImg.src = logo.url;

    logoImg.onload = () => {
      const aspectRatio = logoImg.width / logoImg.height;

      let logoWidth = square.width;
      let logoHeight = square.height;

      if (logoWidth / logoHeight > aspectRatio) {
        logoWidth = logoHeight * aspectRatio;
      } else {
        logoHeight = logoWidth / aspectRatio;
      }

      const offsetX = square.x + (square.width - logoWidth) / 2;
      const offsetY = square.y + (square.height - logoHeight) / 2;

      ctx.drawImage(logoImg, offsetX, offsetY, logoWidth, logoHeight);
    };
  };

  const handleDownload = async () => {
    if (!postSelect || !user) return;

    const contents: ContentToInsert[] = Object.entries(logoSelections)
      .filter(([, logo]) => logo !== null)
      .map(([squareId, logo]) => ({
        squareId: Number(squareId),
        type: 'logo' as const,
        content: logo!
      }));

    // Adicionar os quadrados de texto
    postSelect.squares.forEach((square) => {
      if (square.type === 1) {
        const text = `
          ${user?.address ? user.address : 'Rua Exemplo, 123'}
          ${user?.telephone ? user.telephone : '(11) 99999-9999'}
        `.trim();

        if (text) {
          contents.push({
            squareId: square.id,
            type: 'information' as const,
            content: text
          });
        }
      }
    });

    // Gerar e baixar a imagem com as logos e o texto
    await generateAndDownloadImage(postSelect, contents);
  };

  return (
    <div className="w-[700px]">
      <div ref={containerRef}>
        <canvas ref={canvasRef} />
      </div>

      <div className="mt-10">
        {postSelect?.squares
          .filter((square) => square.type == 0) // Somente quadrados do tipo logo
          .map((square) => (
            <FormControl
              fullWidth
              key={square.id}
              style={{ marginBottom: '16px' }}
            >
              <InputLabel id={`select-label-${square.id}`}>
                Selecione a Logo (Quadrado {square.id})
              </InputLabel>
              <Select
                labelId={`select-label-${square.id}`}
                value={logoSelections[square.id]?.id.toString() || ''}
                onChange={(e) => handleLogoChange(square.id, e)}
              >
                {logos.map((logo) => (
                  <MenuItem value={logo.id.toString()} key={logo.id}>
                    {logo.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ))}
      </div>

      <Button
        variant="contained"
        color="primary"
        onClick={handleDownload}
        style={{ marginTop: '20px' }}
      >
        Baixar Imagem
      </Button>
    </div>
  );
}
