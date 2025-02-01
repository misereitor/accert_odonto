import { logos, posts } from '@prisma/client';

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

export function scaleRectangleByPercentage(
  x: number,
  y: number,
  width: number,
  height: number,
  scalePercentage: number
) {
  return {
    x: Math.round(x / scalePercentage),
    y: Math.round(y / scalePercentage),
    width: Math.round(width / scalePercentage),
    height: Math.round(height / scalePercentage)
  };
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
  post: posts,
  logo: logos | null
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
  if (logo && logo.url) {
    const logoImage = await loadImage(logo.url);
    if (logoImage) {
      const { width: logoWidth, height: logoHeight } = logoImage;
      const aspectRatio = logoWidth / logoHeight;

      let finalLogoWidth = post.square_width;
      let finalLogoHeight = post.square_height;

      if (logoWidth > logoHeight) {
        // Se for mais larga que alta, escala pela largura
        finalLogoHeight = post.square_width / aspectRatio;
        if (finalLogoHeight > post.square_height) {
          finalLogoHeight = post.square_height;
          finalLogoWidth = finalLogoHeight * aspectRatio;
        }
      } else {
        // Se for mais alta que larga, escala pela altura
        finalLogoWidth = post.square_height * aspectRatio;
        if (finalLogoWidth > post.square_width) {
          finalLogoWidth = post.square_width;
          finalLogoHeight = finalLogoWidth / aspectRatio;
        }
      }

      // 6️⃣ Centralizar a logo dentro da área permitida (opcional)
      const offsetX = post.square_x + (post.square_width - finalLogoWidth) / 2;
      const offsetY =
        post.square_y + (post.square_height - finalLogoHeight) / 2;

      // 7️⃣ Desenhar a logo no canvas
      ctx.drawImage(
        logoImage,
        offsetX,
        offsetY,
        finalLogoWidth,
        finalLogoHeight
      );
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
