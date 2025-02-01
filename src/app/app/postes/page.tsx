'use client';

import ModalModel from '@/components/modal/ModalModel';
import ModalDownloadPost from '@/components/posts/modal-download-post';
import { updateUrlPostRepository } from '@/repository/post-repository';
import { generateSignedDownloadUrls } from '@/service/files-service';
import { getAllLogosByUserIdService } from '@/service/logo-service';
import { getAllPostsByPaginationService } from '@/service/post-service';
import { logos, posts } from '@prisma/client';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Home() {
  const [posts, setPosts] = useState<posts[]>([]);
  const [postSelect, setPostSelect] = useState<posts | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [logos, setLogos] = useState<logos[]>([]);
  const [take, setTake] = useState(10);
  const [spik, setSpike] = useState(0);

  useEffect(() => {
    const getPostsAndLogos = async () => {
      const postsDB = await getAllPostsByPaginationService(spik, take);
      const logosDB = await getAllLogosByUserIdService();
      const now = new Date();
      const nowPlusOneDay = new Date(now.getTime() + 60 * 60 * 24000);

      postsDB.map(async (post) => {
        if (!post.url || (post.timestampUrl && post.timestampUrl < now)) {
          post.url = await generateSignedDownloadUrls(post.path);
          post.timestampUrl = nowPlusOneDay;
          await updateUrlPostRepository(post.id, post.url, post.timestampUrl);
        }
        return post;
      });
      setPosts([...posts, ...postsDB]);
      setLogos(logosDB);
    };
    getPostsAndLogos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectPost = (post: posts) => {
    setPostSelect(post);
    setOpenModal(true);
  };
  return (
    <div>
      <ModalModel
        openModal={openModal}
        setOpenModal={setOpenModal}
        height={'full'}
        width={'500px'}
      >
        <ModalDownloadPost
          setPostSelect={setPostSelect}
          postSelect={postSelect}
          logos={logos}
        />
      </ModalModel>
      <div className="flex flex-wrap items-center justify-start">
        {posts.map((post) => (
          <div
            key={post.id}
            onClick={() => handleSelectPost(post)}
            className="cursor-pointer w-1/3"
          >
            <div className="m-2 transition-all duration-300 hover:m-0">
              {post.url && (
                <Image
                  src={post.url}
                  alt={post.name}
                  width={500}
                  height={500}
                  className="rounded-2xl"
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
