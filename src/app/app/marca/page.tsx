'use client';

import { getAllLogosByUserIdService } from '@/service/logo-service';
import {
  Button,
  Skeleton,
  styled,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { logos } from '@prisma/client';
import { useEffect, useState } from 'react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ModalModel from '@/components/modal/ModalModel';
import ModalInsertLogo from '@/components/logo/modal-insert-logo';
import Image from 'next/image';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1
});

export default function Marca() {
  const [logos, setLogos] = useState<logos[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [file, setFile] = useState<File | undefined>();
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const getCols = () => (isMobile ? 2 : isTablet ? 3 : 4);

  useEffect(() => {
    const getAllLogos = async () => {
      const logosUser = await getAllLogosByUserIdService();
      console.log(logosUser);
      setLogos(logosUser);
      setLoading(false);
    };
    getAllLogos();
  }, []);

  const handleFileLoading = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setOpenModal(true);
    }
    event.target.value = '';
  };

  const organizedPosts = () => {
    const portrait = logos.filter(
      (logo) => classifyOrientation(logo) === 'portrait'
    );
    const landscape = logos.filter(
      (logo) => classifyOrientation(logo) === 'landscape'
    );
    const square = logos.filter(
      (logo) => classifyOrientation(logo) === 'square'
    );

    return [...portrait, ...square, ...landscape];
  };

  const classifyOrientation = (logo: logos) => {
    const { width, height } = logo;
    if (width === height) return 'square';
    return width > height ? 'landscape' : 'portrait';
  };

  return (
    <div>
      <div>
        <ModalModel openModal={openModal} setOpenModal={setOpenModal}>
          <ModalInsertLogo file={file} setOpenModal={setOpenModal} />
        </ModalModel>
      </div>
      <div className="h-full ">
        <div className="border-b pb-2 flex justify-end">
          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
          >
            Adicionar
            <VisuallyHiddenInput
              type="file"
              accept="image/*"
              onChange={handleFileLoading}
              multiple
            />
          </Button>
        </div>
      </div>
      <div
        className="p-4 grid gap-4"
        style={{ gridTemplateColumns: `repeat(${getCols()}, 1fr)` }}
      >
        {organizedPosts().map((logo) => (
          <div
            key={logo.id}
            className="cursor-pointer rounded-lg overflow-hidden relative"
            style={{
              gridRowEnd:
                classifyOrientation(logo) === 'landscape'
                  ? 'span 1'
                  : classifyOrientation(logo) === 'portrait'
                    ? 'span 3'
                    : 'span 1'
            }}
          >
            <div className="bg-[var(--border)] p-2 rounded-md m-2 flex flex-col items-center justify-center">
              {logo.url ? (
                <Image
                  src={logo.url}
                  alt={logo.name}
                  width={200}
                  height={200}
                />
              ) : (
                ''
              )}
              <div className="flex items-center justify-center mt-1">
                <span className="text-[var(--secondary-text)] font-bold">
                  {logo.name}
                </span>
              </div>
            </div>
          </div>
        ))}
        {loading &&
          Array.from(new Array(getCols() * 2)).map((_, index) => (
            <Skeleton
              key={index}
              variant="rectangular"
              width="100%"
              height={200}
            />
          ))}
      </div>
    </div>
  );
}
