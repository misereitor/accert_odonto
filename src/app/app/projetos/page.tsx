'use client';
import { Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import ListProjetos from '@/components/projetos/list-projetos';
import ModalUploadProjeto from '@/components/modal/ModalModel';
import ModalUploadFile from '../../../components/projetos/modal-upload-file';

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

export default function Projetos() {
  const [openModal, setOpenModal] = useState(false);
  const [file, setFile] = useState<File | undefined>();
  const handleFileLoading = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      const allowedTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
        'video/mp4',
        'video/webm'
      ];
      if (!allowedTypes.includes(event.target.files[0].type)) {
        console.log('as');
        alert(
          `O arquivo ${event.target.files[0].name} não é um tipo permitido.`
        );
        event.target.value = '';
        return;
      }
      setFile(event.target.files[0]);
      setOpenModal(true);
    }
    event.target.value = '';
  };

  return (
    <div className="w-full h-full">
      <ModalUploadProjeto openModal={openModal} setOpenModal={setOpenModal}>
        <ModalUploadFile setOpenModal={setOpenModal} file={file} />
      </ModalUploadProjeto>
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
              accept="image/*,video/*"
              onChange={handleFileLoading}
              multiple
            />
          </Button>
        </div>
      </div>
      <ListProjetos />
    </div>
  );
}
