import { Button, TextField } from '@mui/material';
import { posts } from '@prisma/client';
import { Dispatch, FormEvent, SetStateAction, useState } from 'react';
import { IoCloseCircleOutline } from 'react-icons/io5';
import { scaleRectangleByPercentage } from '../../../util/resize-image-proportionally';
import {
  generateSignedDownloadUrls,
  generateSignedUrl
} from '@/service/files-service';
import { getUserByToken } from '@/service/user-service';
import axios from 'axios';
import { savePostService } from '@/service/post-service';

type Props = {
  setStage: Dispatch<SetStateAction<number>>;
  file: File | undefined;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
  scalePercentage: number;
  rect: {
    x: number;
    y: number;
    width: number;
    height: number;
  } | null;
  sizeImage: {
    width: number;
    height: number;
  } | null;
};

export default function RegisterImage({
  setStage,
  rect,
  scalePercentage,
  sizeImage,
  file,
  setOpenModal
}: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [filter, setFilter] = useState('');
  const [filterArray, setFilterArray] = useState<string[]>([]);
  const [errorFilter, setErrorFilter] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) return;
    const user = await getUserByToken();
    const now = new Date();
    const nowPlusOneDay = new Date(now.getTime() + 60 * 60 * 24000);
    handleSetFilter();
    setErrorFilter('');
    setFilter('');
    let squereSize: {
      x: number;
      y: number;
      width: number;
      height: number;
    } | null = null;
    if (rect) {
      squereSize = scaleRectangleByPercentage(
        rect.x,
        rect.y,
        rect.width,
        rect.height,
        scalePercentage
      );
    }
    try {
      const urlOracle = await generateSignedUrl(
        file.name.split('.')[file.name.split('.').length - 1]
      );
      const response = await axios.put(urlOracle.signedUrl, file, {
        headers: {
          'Content-Type': file.type
        }
      });
      if (response.status === 200) {
        const post: posts = {
          name,
          id: 0,
          path: urlOracle.filePath.path,
          name_unique: urlOracle.filePath.fileNameRandon,
          size: file.size,
          filter: filterArray,
          description,
          active: true,
          user_id: user.id,
          width: sizeImage?.width || 0,
          height: sizeImage?.height || 0,
          type: 0,
          square_x: squereSize?.x || 0,
          square_y: squereSize?.y || 0,
          square_width: squereSize?.width || 0,
          square_height: squereSize?.height || 0,
          accept_logo: !!rect,
          url: await generateSignedDownloadUrls(urlOracle.filePath.path),
          timestampUrl: nowPlusOneDay
        };
        console.log(post);
        await savePostService(post);
        setOpenModal(false);
      }
    } catch (error: unknown) {
      console.error('Erro ao salvar o arquivo', error);
    }
  };

  const handleSetFilter = () => {
    setErrorFilter('');
    if (filter == '') return;
    const find = filterArray.find((fill) => filter === fill);
    if (find) {
      setErrorFilter('Filtro já existe');
      return;
    }
    setFilterArray([...filterArray, filter]);
    setFilter('');
  };

  const handleRemoveFilter = (fill: string) => {
    const remove = filterArray.filter((f) => f != fill);
    setFilterArray(remove);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="flex justify-between my-2">
          <Button
            variant="contained"
            color="primary"
            type="button"
            onClick={() => setStage(0)}
          >
            Voltar
          </Button>

          <Button
            variant="contained"
            color="primary"
            type="submit"
            onClick={() => setStage(1)}
          >
            Salvar
          </Button>
        </div>
        <div className="w-full flex flex-col">
          <TextField
            id="outlined-basic"
            label="Nome"
            variant="outlined"
            value={name}
            type="text"
            onChange={(e) => setName(e.target.value)}
            sx={{
              marginBottom: 2
            }}
          />
          <TextField
            id="outlined-basic"
            label="Descrição"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            variant="outlined"
            type="text"
            sx={{
              marginBottom: 2
            }}
          />
          <div className="flex justify-between w-full items-center">
            <TextField
              sx={{
                width: '100%',
                marginRight: 2
              }}
              id="outlined-basic"
              error={errorFilter != ''}
              helperText={errorFilter}
              label="Filtros"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              variant="outlined"
              type="text"
            />
            <Button
              onClick={handleSetFilter}
              type="button"
              variant="contained"
              color="primary"
              sx={{
                height: 36.5
              }}
            >
              Adicionar
            </Button>
          </div>
          <div className="flex items-end justify-start mt-4">
            {filterArray.map((fill, index) => (
              <div
                key={index}
                className="mx-1 px-2 rounded-md py-1 flex items-center justify-between bg-[var(--secondary-text)] text-[var(--border)]"
              >
                <p>{fill}</p>
                <button
                  type="button"
                  className="ml-1"
                  onClick={() => handleRemoveFilter(fill)}
                >
                  <IoCloseCircleOutline size={24} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}
