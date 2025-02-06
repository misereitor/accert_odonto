import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  TextField
} from '@mui/material';
import { posts, type_post } from '@prisma/client';
import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState
} from 'react';
import { IoCloseCircleOutline } from 'react-icons/io5';
import { scaleRectangleByPercentage } from '../../../util/resize-image-proportionally';
import {
  generateSignedDownloadUrls,
  generateSignedUrl
} from '@/service/files-service';
import { getUserByToken } from '@/service/user-service';
import axios, { AxiosProgressEvent } from 'axios';
import { savePostService } from '@/service/post-service';
import { getAllTypePostsRepository } from '@/repository/post-repository';
import { SquaresMeasure } from '@/model/post-model';

type Props = {
  setStage: Dispatch<SetStateAction<number>>;
  file: File | undefined;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
  rects: SquaresMeasure[];
  sizeImage: {
    width: number;
    height: number;
  } | null;
};

export default function RegisterImage({
  setStage,
  rects,
  sizeImage,
  file,
  setOpenModal
}: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [filter, setFilter] = useState('');
  const [filterArray, setFilterArray] = useState<string[]>([]);
  const [errorFilter, setErrorFilter] = useState('');
  const [selectTypePost, setSelectTypePost] = useState<type_post[]>([]);
  const [typePost, setTypePost] = useState('');
  const [typeMedia, setTypeMedia] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isUpload, setIsUpload] = useState(false);

  useEffect(() => {
    const typeMediaSet = () => {
      if (!file) {
        return 10;
      }
      const type = file.type.split('/')[0];
      switch (type) {
        case 'image':
          return 0;
        case 'video':
          return 1;
        default:
          return 10;
      }
    };
    setTypeMedia(typeMediaSet);
    const tyoePosts = async () => {
      const types = await getAllTypePostsRepository(typeMediaSet());
      setSelectTypePost(types);
    };
    tyoePosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!file) {
    return <>Arquivo não existe</>;
  }

  const handleProgressUpload = (progressEvent: AxiosProgressEvent) => {
    const total = progressEvent.total ?? file.size;
    const percentCompleted = Math.round((progressEvent.loaded * 100) / total);
    setProgress(percentCompleted);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const user = await getUserByToken();
    const now = new Date();
    const nowPlusOneDay = new Date(now.getTime() + 60 * 60 * 24000);
    handleSetFilter();
    setErrorFilter('');
    setFilter('');

    const squereSize = scaleRectangleByPercentage(rects);

    try {
      setIsUpload(true);
      const urlOracle = await generateSignedUrl(
        file.name.split('.')[file.name.split('.').length - 1]
      );
      const response = await axios.put(urlOracle.signedUrl, file, {
        headers: {
          'Content-Type': file.type
        },
        onUploadProgress: handleProgressUpload
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
          type_media: typeMedia,
          type_post_id: typePost === '' ? 0 : Number(typePost),
          accept_logo: rects.length > 0,
          url: await generateSignedDownloadUrls(urlOracle.filePath.path),
          timestampUrl: nowPlusOneDay,
          accept_information: rects.length > 0
        };
        await savePostService(post, squereSize);
        setOpenModal(false);
      }
    } catch (error: unknown) {
      console.error('Erro ao salvar o arquivo', error);
    } finally {
      setIsUpload(false);
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
    <div className="w-[500px]">
      <form onSubmit={handleSubmit}>
        <div className="flex justify-between my-2">
          <Button
            loading={isUpload}
            loadingPosition="start"
            variant="contained"
            color="primary"
            type="button"
            onClick={() => setStage(0)}
          >
            Voltar
          </Button>

          <Button
            loading={isUpload}
            loadingPosition="start"
            variant="contained"
            color="primary"
            type="submit"
            onClick={() => setStage(1)}
          >
            Salvar
          </Button>
        </div>
        <div className="my-4">
          {isUpload && (
            <LinearProgress variant="determinate" value={progress} />
          )}
        </div>
        <div className="w-full flex flex-col">
          <TextField
            required
            id="outlined-basic"
            label="Nome"
            variant="outlined"
            value={name}
            type="text"
            onChange={(e) => setName(e.target.value)}
          />
          <FormHelperText
            sx={{
              marginBottom: 2,
              marginLeft: 2
            }}
          >
            Obrigatório
          </FormHelperText>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition duration-100 hover:border-gray-900 "
            required
            rows={5}
            id="outlined-basic"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <FormHelperText
            sx={{
              marginBottom: 2,
              marginLeft: 2
            }}
          >
            Obrigatório
          </FormHelperText>
          <div>
            <FormControl
              required
              sx={{
                width: '100%'
              }}
            >
              <InputLabel id="Type-post">Tipo</InputLabel>
              <Select
                labelId="Type-post"
                id="Type-post-required"
                value={typePost}
                label="Tipo *"
                onChange={(e) => setTypePost(e.target.value)}
                sx={{
                  width: '100%'
                }}
              >
                {selectTypePost.map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.type}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText
                sx={{
                  marginBottom: 2,
                  marginLeft: 2
                }}
              >
                Obrigatório
              </FormHelperText>
            </FormControl>
          </div>
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
