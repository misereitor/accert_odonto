'use client';

import ModalModel from '@/components/modal/ModalModel';
import ListVideoPlay from '@/components/video/list-video';
import ModalDownloadVideo from '@/components/video/modal-download-video';
import { getAllPostsByPaginationService } from '@/service/post-service';
import { Skeleton, useMediaQuery, useTheme } from '@mui/material';
import { posts } from '@prisma/client';
import { useCallback, useEffect, useState } from 'react';

export default function Reels() {
  const [posts, setPosts] = useState<posts[]>([]);
  const [videoSelected, setVideoSelected] = useState<posts | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const take = 20;
  const [spik, setSpik] = useState(0);

  const getCols = () => (isMobile ? 2 : isTablet ? 3 : 4);

  const fetchPhotos = useCallback(async () => {
    setLoading(true);
    try {
      const newPhotos = await getAllPostsByPaginationService(spik, take, 1, [
        7
      ]);

      setPosts(newPhotos);

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

  const classifyOrientation = (post: posts) => {
    const { width, height } = post;
    if (width === height) return 'square';
    return width > height ? 'landscape' : 'portrait';
  };

  const organizedPosts = () => {
    const portrait = posts.filter(
      (post) => classifyOrientation(post) === 'portrait'
    );
    const landscape = posts.filter(
      (post) => classifyOrientation(post) === 'landscape'
    );
    const square = posts.filter(
      (post) => classifyOrientation(post) === 'square'
    );

    return [...portrait, ...square, ...landscape];
  };

  const handleSelectPost = (post: posts) => {
    setVideoSelected(post);
    setOpenModal(true);
  };

  return (
    <div>
      <ModalModel openModal={openModal} setOpenModal={setOpenModal}>
        <ModalDownloadVideo
          setVideoSelected={setVideoSelected}
          videoSelected={videoSelected}
        />
      </ModalModel>
      <div
        className="p-4 grid gap-4"
        style={{ gridTemplateColumns: `repeat(${getCols()}, 1fr)` }}
      >
        {organizedPosts().map((video) => (
          <div
            key={video.id}
            className="cursor-pointer rounded-lg overflow-hidden relative"
            onClick={() => handleSelectPost(video)}
            style={{
              gridRowEnd:
                classifyOrientation(video) === 'landscape'
                  ? 'span 1'
                  : classifyOrientation(video) === 'portrait'
                    ? 'span 3'
                    : 'span 1'
            }}
          >
            {video.url ? (
              <ListVideoPlay video={video} />
            ) : (
              <Skeleton variant="rectangular" width="100%" height={200} />
            )}
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
