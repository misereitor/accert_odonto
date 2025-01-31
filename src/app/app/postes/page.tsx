'use client';

import { updateUrlPostRepository } from '@/repository/post-repository';
import { generateSignedDownloadUrls } from '@/service/files-service';
import { getAllPostsByPaginationService } from '@/service/post-service';
import { posts } from '@prisma/client';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Home() {
  const [posts, setPosts] = useState<posts[]>([]);
  const [take, setTake] = useState(10);
  const [spik, setSpike] = useState(0);

  useEffect(() => {
    const getPosts = async () => {
      const postsDB = await getAllPostsByPaginationService(spik, take);
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
    };
    getPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  console.log(posts);
  return (
    <div>
      <div>
        {posts.map((post) => (
          <div key={post.id}>
            {post.url && (
              <Image src={post.url} alt={post.name} width={500} height={500} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
