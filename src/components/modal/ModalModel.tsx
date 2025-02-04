import { IoCloseCircleOutline } from 'react-icons/io5';
import { Box, Modal } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';
type Props = {
  setOpenModal: Dispatch<SetStateAction<boolean>>;
  openModal: boolean;
  children: React.ReactNode;
};

export default function ModalModel({
  setOpenModal,
  openModal,
  children
}: Props) {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    p: 3,
    borderRadius: '20px'
  };

  return (
    <div>
      <Modal
        open={openModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="w-full flex justify-end">
            <button type="button" onClick={() => setOpenModal(false)}>
              <IoCloseCircleOutline size={30} />
            </button>
          </div>
          <div>{children}</div>
        </Box>
      </Modal>
    </div>
  );
}
