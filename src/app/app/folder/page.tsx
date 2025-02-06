'use client';

import ModalModel from '@/components/modal/ModalModel';
import ModalDownloadPost from '@/components/posts/modal-download-post';
import { getAllLogosByUserIdService } from '@/service/logo-service';
import { getAllPostsByPaginationService } from '@/service/post-service';
import { useTheme } from '@mui/material/styles';
import { ImageListItem, Skeleton, useMediaQuery } from '@mui/material';
import { logos } from '@prisma/client';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { Posts } from '@/model/post-model';

export default function Postes() {
  const [posts, setPosts] = useState<Posts[]>([]);
  const [postSelect, setPostSelect] = useState<Posts | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [logos, setLogos] = useState<logos[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const take = 20;
  const [spik, setSpik] = useState(0);

  const getCols = () => {
    if (isMobile) return 2;
    if (isTablet) return 3;
    return 4;
  };

  const fetchPhotos = useCallback(async () => {
    setLoading(true);
    try {
      const newPhotos = await getAllPostsByPaginationService(spik, take, 0, [
        10
      ]);
      const logosDB = await getAllLogosByUserIdService();
      setLogos(logosDB);

      setPosts((prevPosts) => [...prevPosts, ...newPhotos]);
      setSpik((prevSpik) => prevSpik + take);
      setHasMore(newPhotos.length > 0);
    } catch (error) {
      console.error('Erro ao buscar posts:', error);
    } finally {
      setLoading(false);
    }
  }, [spik, take]);

  useEffect(() => {
    fetchPhotos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 300 &&
        !loading &&
        hasMore
      ) {
        fetchPhotos();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [fetchPhotos, loading, hasMore]);

  const handleSelectPost = (post: Posts) => {
    setPostSelect(post);
    setOpenModal(true);
  };

  return (
    <div className="p-4">
      <ModalModel openModal={openModal} setOpenModal={setOpenModal}>
        <ModalDownloadPost
          setPostSelect={setPostSelect}
          postSelect={postSelect}
          logos={logos}
        />
      </ModalModel>
      <div
        className="p-4 grid gap-4"
        style={{ gridTemplateColumns: `repeat(${getCols()}, 1fr)` }}
      >
        {posts.map((photo) => (
          <div
            key={photo.id}
            onClick={() => handleSelectPost(photo)}
            className="cursor-pointer"
          >
            {photo.url ? (
              <Image
                src={photo.url}
                alt="Gallery item"
                loading="lazy"
                width={300}
                height={529}
                className="rounded-lg"
              />
            ) : (
              <Skeleton
                variant="rectangular"
                width="100%"
                height={529}
                sx={{ borderRadius: 2 }}
              />
            )}
          </div>
        ))}

        {/* Skeletons durante o carregamento */}
        {loading &&
          Array.from(new Array(getCols() * 2)).map((_, index) => (
            <ImageListItem key={`skeleton-${index}`} cols={1} rows={1}>
              <Skeleton
                variant="rectangular"
                width="100%"
                height={529}
                sx={{ borderRadius: 2 }}
              />
            </ImageListItem>
          ))}
      </div>
    </div>
  );
}
