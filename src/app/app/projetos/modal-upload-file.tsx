import { generateSignedUrl } from '@/service/files-service';
import { savePostService } from '@/service/post-service';
import { Box, LinearProgress } from '@mui/material';
import { posts } from '@prisma/client';
import axios from 'axios';
import { useEffect, useState } from 'react';

type Props = {
  file: File | undefined;
};

export default function ModalUploadFile({ file }: Props) {
  const [nameFile, setNameFile] = useState('');
  const [description, setDescription] = useState('');
  const [success, setSuccess] = useState<boolean | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleFileUpload = async (file: File) => {
      setSuccess(null);
      const fileSplit = file.name.split('.');
      const signedUrl = await generateSignedUrl(
        fileSplit[fileSplit.length - 1]
      );

      const response = await axios.put(signedUrl.signedUrl, file, {
        headers: {
          'Content-Type': file.type
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentComplete = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            setProgress(percentComplete);
          }
        }
      });
      if (response.status === 200) {
        setSuccess(true);
        const post: posts = {
          filter: '',
          path: signedUrl.filePath.path,
          name_unique: signedUrl.filePath.fileNameRandon,
          name: nameFile,
          id: 0,
          size: file.size,
          description: description,
          user_id: 0,
          active: true,
          height: 0,
          type: 0,
          width: 0
        };
        await savePostService(post);
      }
      setSuccess(false);
    };
    if (file) handleFileUpload(file);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  return (
    <div>
      {progress < 100 && (
        <Box sx={{ width: '100%' }}>
          <LinearProgress variant="determinate" value={progress} />
        </Box>
      )}
    </div>
  );
}
