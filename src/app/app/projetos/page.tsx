'use client';
import { Button, Menu } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import ListProjetos from '@/components/projetos/list-projetos';
import ModalUploadProjeto from '@/components/modal/ModalModel';
import ModalUploadFile from '../../../components/projetos/modal-upload-file';
import ModalUploadSticker from '@/components/projetos/modal-upload-sticker';

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
  const [openModalSticker, setOpenModalSticker] = useState(false);
  const [file, setFile] = useState<File | undefined>();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

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
        alert(
          `O arquivo ${event.target.files[0].name} não é um tipo permitido.`
        );
        event.target.value = '';
        return;
      }
      setFile(event.target.files[0]);
      handleClose();
      setOpenModal(true);
    }
    event.target.value = '';
  };

  const handleFileLoadingSticker = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      const allowedTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp'
      ];
      if (!allowedTypes.includes(event.target.files[0].type)) {
        alert(
          `O arquivo ${event.target.files[0].name} não é um tipo permitido.`
        );
        event.target.value = '';
        return;
      }
      setFile(event.target.files[0]);
      handleClose();
      setOpenModalSticker(true);
    }
    event.target.value = '';
  };

  return (
    <div className="w-full h-full">
      <ModalUploadProjeto openModal={openModal} setOpenModal={setOpenModal}>
        <ModalUploadFile setOpenModal={setOpenModal} file={file} />
      </ModalUploadProjeto>
      <ModalUploadProjeto
        openModal={openModalSticker}
        setOpenModal={setOpenModalSticker}
      >
        <ModalUploadSticker setOpenModal={setOpenModalSticker} file={file} />
      </ModalUploadProjeto>

      <div className="h-full">
        <div className="border-b pb-2 flex justify-end">
          <Button
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
          >
            Adicionar
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button'
            }}
            sx={{
              width: 200
            }}
          >
            <Button
              sx={{
                width: '140px',
                margin: 1
              }}
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
            >
              Posts
              <VisuallyHiddenInput
                type="file"
                accept="image/*,video/*"
                onChange={handleFileLoading}
                multiple
              />
            </Button>

            <Button
              component="label"
              role={undefined}
              sx={{
                width: '140px',
                margin: 1
              }}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
            >
              Sticker
              <VisuallyHiddenInput
                type="file"
                accept="image/*"
                onChange={handleFileLoadingSticker}
                multiple
              />
            </Button>
          </Menu>
        </div>
      </div>
      <ListProjetos />
    </div>
  );
}
