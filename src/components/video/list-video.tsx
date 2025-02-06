import { Posts } from '@/model/post-model';
import { useRef, useState } from 'react';

type Props = {
  video: Posts;
};

export default function ListVideoPlay({ video }: Props) {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    videoRef.current?.play();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    videoRef.current?.pause();
  };

  return (
    <div
      className="relative w-full  overflow-hidden rounded-lg shadow-md"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Legenda */}
      {!isHovered && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-xl font-semibold transition-opacity duration-300">
          {video.name}
        </div>
      )}

      {/* Vídeo */}
      {video.url && (
        <video
          ref={videoRef}
          src={video.url}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          muted
          playsInline
        />
      )}
    </div>
  );
}
