'use client';

import { getAllLogosByUserIdService } from '@/service/logo-service';
import { Button, styled } from '@mui/material';
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

export default function Home() {
  const [logos, setLogos] = useState<logos[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [file, setFile] = useState<File | undefined>();

  useEffect(() => {
    const getAllLogos = async () => {
      const logosUser = await getAllLogosByUserIdService();
      console.log(logosUser);
      setLogos(logosUser);
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
  return (
    <div>
      <div>
        <ModalModel
          openModal={openModal}
          setOpenModal={setOpenModal}
          height={'full'}
          width={'450px'}
        >
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
      <div className="flex items-center justify-start mt-5 flex-wrap">
        {logos.map((logo) => (
          <div key={logo.id} className="w-1/4">
            <div className="bg-[var(--border)] p-2 rounded-md m-2">
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
      </div>
    </div>
  );
}
