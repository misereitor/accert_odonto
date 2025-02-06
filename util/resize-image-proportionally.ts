import { ContentToInsert, Posts, SquaresMeasure } from '@/model/post-model';
import { squares } from '@prisma/client';

export function resizeImageByWidth(
  originalWidth: number,
  originalHeight: number,
  targetWidth: number
) {
  const scalePercentage = targetWidth / originalWidth;
  const newHeight = Math.round(originalHeight * scalePercentage);

  return {
    width: targetWidth,
    height: newHeight,
    scalePercentage
  };
}

export function scaleRectangleByPercentage(squaresMeasure: SquaresMeasure[]) {
  const squares = squaresMeasure.map((measure) => {
    return {
      x: Math.round(measure.x / measure.scalePercentage),
      y: Math.round(measure.y / measure.scalePercentage),
      width: Math.round(measure.width / measure.scalePercentage),
      height: Math.round(measure.height / measure.scalePercentage),
      type: measure.type
    };
  });
  return squares as unknown as squares[];
}

export function scaleRectangleToSmallerImage(
  x: number,
  y: number,
  width: number,
  height: number,
  scalePercentage: number
) {
  return {
    x: Math.round(x * scalePercentage),
    y: Math.round(y * scalePercentage),
    width: Math.round(width * scalePercentage),
    height: Math.round(height * scalePercentage)
  };
}

export async function resizeImageByFile(file: File, width: number) {
  return new Promise<{
    imageResize: Blob | null;
    sizeImageResize: {
      width: number;
      height: number;
      scalePercentage: number;
    } | null;
    sizeImage: {
      width: number;
      height: number;
    };
  }>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        // Redimensiona a imagem de acordo com a altura
        const sizeImageResize = resizeImageByWidth(
          img.width,
          img.height,
          width
        );
        const sizeImage = { width: img.width, height: img.height };
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          return reject(
            new Error('Não foi possível obter o contexto do canvas')
          );
        }

        // Define o novo tamanho do canvas
        canvas.width = sizeImageResize.width;
        canvas.height = sizeImageResize.height;

        // Desenha a imagem redimensionada no canvas
        ctx.drawImage(img, 0, 0, sizeImageResize.width, sizeImageResize.height);

        // Converte para Blob
        canvas.toBlob((blob) => {
          if (blob) {
            resolve({ imageResize: blob, sizeImageResize, sizeImage });
          } else {
            reject(new Error('Erro ao converter a imagem para Blob'));
          }
        }, file.type);
      };

      img.onerror = () => reject(new Error('Erro ao carregar a imagem'));
    };

    reader.onerror = () => reject(new Error('Erro ao ler o arquivo'));
    reader.readAsDataURL(file);
  });
}

export async function resizeImageByFileUrl(url: string, width: number) {
  return new Promise<{
    imageResize: Blob | null;
    sizeImageResize: {
      width: number;
      height: number;
      scalePercentage: number;
    } | null;
    sizeImage: {
      width: number;
      height: number;
    };
  }>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // Importante para evitar problemas de CORS se a imagem estiver em outro domínio
    img.src = url;

    img.onload = () => {
      // Redimensiona a imagem de acordo com a largura
      const sizeImageResize = resizeImageByWidth(img.width, img.height, width);
      const sizeImage = { width: img.width, height: img.height };

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        return reject(new Error('Não foi possível obter o contexto do canvas'));
      }

      // Define o novo tamanho do canvas
      canvas.width = sizeImageResize.width;
      canvas.height = sizeImageResize.height;

      // Desenha a imagem redimensionada no canvas
      ctx.drawImage(img, 0, 0, sizeImageResize.width, sizeImageResize.height);

      // Converte o canvas para Blob (definindo o tipo de imagem, ex: "image/png")
      canvas.toBlob((blob) => {
        if (blob) {
          resolve({ imageResize: blob, sizeImageResize, sizeImage });
        } else {
          reject(new Error('Erro ao converter a imagem para Blob'));
        }
      }, 'image/png'); // Altere o tipo de imagem se necessário
    };

    img.onerror = () => reject(new Error('Erro ao carregar a imagem'));
  });
}

export async function generateAndDownloadImage(
  post: Posts,
  contents: ContentToInsert[]
) {
  // 1️⃣ Carregar imagem do post
  if (!post.url) return;
  const postImage = await loadImage(post.url);
  if (!postImage) return;

  // 2️⃣ Criar canvas com o tamanho da imagem original
  const canvas = document.createElement('canvas');
  canvas.width = postImage.width;
  canvas.height = postImage.height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 3️⃣ Desenhar imagem do post
  ctx.drawImage(postImage, 0, 0);

  // 4️⃣ Carregar e desenhar logo
  for (const item of contents) {
    const square = post.squares.find((sq) => sq.id === item.squareId);
    if (!square) continue; // Pular se o quadrado não existir

    if (item.type === 'logo' && typeof item.content !== 'string') {
      // 📦 Inserir LOGO
      const logo = item.content;
      const logoImage = await loadImage(logo.url);
      if (logoImage) {
        const aspectRatio = logoImage.width / logoImage.height;

        let finalLogoWidth = square.width;
        let finalLogoHeight = square.height;

        // Ajuste de proporção
        if (logoImage.width > logoImage.height) {
          finalLogoHeight = square.width / aspectRatio;
          if (finalLogoHeight > square.height) {
            finalLogoHeight = square.height;
            finalLogoWidth = finalLogoHeight * aspectRatio;
          }
        } else {
          finalLogoWidth = square.height * aspectRatio;
          if (finalLogoWidth > square.width) {
            finalLogoWidth = square.width;
            finalLogoHeight = finalLogoWidth / aspectRatio;
          }
        }

        // Centralizar dentro do quadrado
        const offsetX = square.x + (square.width - finalLogoWidth) / 2;
        const offsetY = square.y + (square.height - finalLogoHeight) / 2;

        // Desenhar logo
        ctx.drawImage(
          logoImage,
          offsetX,
          offsetY,
          finalLogoWidth,
          finalLogoHeight
        );
      }
    } else if (
      item.type === 'information' &&
      typeof item.content === 'string'
    ) {
      // 📝 Inserir INFORMAÇÃO (texto)
      const text = item.content;

      ctx.font = 'bold 16px Arial';
      ctx.fillStyle = 'black'; // Cor do texto
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const centerX = square.x + square.width / 2;
      const centerY = square.y + square.height / 2;

      // Ajustar o texto para caber no espaço
      wrapText(ctx, text, centerX, centerY, square.width - 10, 20);
    }
  }

  // 5️⃣ Baixar a imagem final
  const link = document.createElement('a');
  link.href = canvas.toDataURL('image/png'); // Converte para base64
  link.download = post.name;
  link.click();
}

// Função auxiliar para carregar imagens
function loadImage(url: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // Permitir CORS
    img.src = url;
    img.onload = () => resolve(img);
    img.onerror = () => {
      console.error(`Erro ao carregar imagem: ${url}`);
      resolve(null);
    };
  });
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(' ');
  let line = '';
  let currentY = y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;

    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, currentY);
      line = words[n] + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, currentY);
}
