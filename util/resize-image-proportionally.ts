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

export async function resizeImage(file: File, width: number) {
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
