import {
  BiBookmarkHeart,
  BiCarousel,
  BiChalkboard,
  BiDetail,
  BiHomeHeart,
  BiImage,
  BiMobile,
  BiMobileAlt,
  BiMoviePlay,
  BiNews,
  BiRegistered,
  BiSolidBookmarkHeart,
  BiSolidCarousel,
  BiSolidChalkboard,
  BiSolidDetail,
  BiSolidHomeHeart,
  BiSolidImage,
  BiSolidMoviePlay,
  BiSolidNews,
  BiSolidRegistered,
  BiSolidSticker,
  BiSolidTv,
  BiSticker,
  BiTv
} from 'react-icons/bi';

export const menu = {
  user: [
    {
      title: 'Início',
      path: '/app/home',
      icon: [
        <BiHomeHeart
          key="dashboard"
          className="text-[var(--button)] ml-3 group-hover:text-blue-500"
          size={24}
        />,
        <BiSolidHomeHeart
          key="dashboard"
          className="text-[var(--secondary-button)] ml-3 group-hover:text-blue-500"
          size={24}
        />
      ]
    },
    {
      title: 'Salvos',
      path: '/app/salvos',
      icon: [
        <BiBookmarkHeart
          key="Clientes"
          className="text-[var(--button)] ml-3 group-hover:text-blue-500"
          size={24}
        />,
        <BiSolidBookmarkHeart
          key="Clientes"
          className="text-[var(--secondary-button)] ml-3 group-hover:text-blue-500"
          size={24}
        />
      ]
    },
    {
      title: 'Postes',
      path: '/app/postes',
      icon: [
        <BiImage
          key="Clientes"
          className="text-[var(--button)] ml-3 group-hover:text-blue-500"
          size={24}
        />,
        <BiSolidImage
          key="Clientes"
          className="text-[var(--secondary-button)] ml-3 group-hover:text-blue-500"
          size={24}
        />
      ]
    },

    {
      title: 'Panfletos',
      path: '/app/panfletos',
      icon: [
        <BiDetail
          key="Clientes"
          className="text-[var(--button)] ml-3 group-hover:text-blue-500"
          size={24}
        />,
        <BiSolidDetail
          key="Clientes"
          className="text-[var(--secondary-button)] ml-3 group-hover:text-blue-500"
          size={24}
        />
      ]
    },
    {
      title: 'Stores Fotos',
      path: '/app/stores-fotos',
      icon: [
        <BiMobileAlt
          key="Clientes"
          className="text-[var(--button)] ml-3 group-hover:text-blue-500"
          size={24}
        />,
        <BiMobile
          key="Clientes"
          className="text-[var(--secondary-button)] ml-3 group-hover:text-blue-500"
          size={24}
        />
      ]
    },
    {
      title: 'Stores Videos',
      path: '/app/stores-videos',
      icon: [
        <BiMoviePlay
          key="Clientes"
          className="text-[var(--button)] ml-3 group-hover:text-blue-500"
          size={24}
        />,
        <BiSolidMoviePlay
          key="Clientes"
          className="text-[var(--secondary-button)] ml-3 group-hover:text-blue-500"
          size={24}
        />
      ]
    },
    {
      title: 'Lâminas de Apresentação',
      path: '/app/laminas-de-apresentacao',
      icon: [
        <BiNews
          key="Clientes"
          className="text-[var(--button)] ml-3 group-hover:text-blue-500"
          size={24}
        />,
        <BiSolidNews
          key="Clientes"
          className="text-[var(--secondary-button)] ml-3 group-hover:text-blue-500"
          size={24}
        />
      ]
    },
    {
      title: 'Stickers (Figurinhas)',
      path: '/app/stickers',
      icon: [
        <BiSticker
          key="Clientes"
          className="text-[var(--button)] ml-3 group-hover:text-blue-500"
          size={24}
        />,
        <BiSolidSticker
          key="Clientes"
          className="text-[var(--secondary-button)] ml-3 group-hover:text-blue-500"
          size={24}
        />
      ]
    },
    {
      title: 'Folder',
      path: '/app/folder',
      icon: [
        <BiCarousel
          key="Clientes"
          className="text-[var(--button)] ml-3 group-hover:text-blue-500"
          size={24}
        />,
        <BiSolidCarousel
          key="Clientes"
          className="text-[var(--secondary-button)] ml-3 group-hover:text-blue-500"
          size={24}
        />
      ]
    },
    {
      title: 'Reels',
      path: '/app/reels',
      icon: [
        <BiMoviePlay
          key="Clientes"
          className="text-[var(--button)] ml-3 group-hover:text-blue-500"
          size={24}
        />,
        <BiSolidMoviePlay
          key="Clientes"
          className="text-[var(--secondary-button)] ml-3 group-hover:text-blue-500"
          size={24}
        />
      ]
    },
    {
      title: 'Videos TV',
      path: '/app/videos-tv',
      icon: [
        <BiTv
          key="Clientes"
          className="text-[var(--button)] ml-3 group-hover:text-blue-500"
          size={24}
        />,
        <BiSolidTv
          key="Clientes"
          className="text-[var(--secondary-button)] ml-3 group-hover:text-blue-500"
          size={24}
        />
      ]
    },
    {
      title: 'Marca',
      path: '/app/marca',
      icon: [
        <BiRegistered
          key="planos"
          className="text-[var(--button)] ml-3 group-hover:text-blue-500"
          size={24}
        />,
        <BiSolidRegistered
          key="planos"
          className="text-[var(--secondary-button)] ml-3 group-hover:text-blue-500"
          size={24}
        />
      ]
    }
  ],
  desing: [
    {
      title: 'Início',
      path: '/app/home',
      icon: [
        <BiHomeHeart
          key="dashboard"
          className="text-[var(--button)] ml-3 group-hover:text-blue-500"
          size={24}
        />,
        <BiSolidHomeHeart
          key="dashboard"
          className="text-[var(--secondary-button)] ml-3 group-hover:text-blue-500"
          size={24}
        />
      ]
    },
    {
      title: 'Projetos',
      path: '/app/projetos',
      icon: [
        <BiChalkboard
          key="Clientes"
          className="text-[var(--button)] ml-3 group-hover:text-blue-500"
          size={24}
        />,
        <BiSolidChalkboard
          key="Clientes"
          className="text-[var(--secondary-button)] ml-3 group-hover:text-blue-500"
          size={24}
        />
      ]
    },
    {
      title: 'Postes',
      path: '/app/postes',
      icon: [
        <BiImage
          key="Clientes"
          className="text-[var(--button)] ml-3 group-hover:text-blue-500"
          size={24}
        />,
        <BiSolidImage
          key="Clientes"
          className="text-[var(--secondary-button)] ml-3 group-hover:text-blue-500"
          size={24}
        />
      ]
    },
    {
      title: 'Panfletos',
      path: '/app/panfletos',
      icon: [
        <BiDetail
          key="Clientes"
          className="text-[var(--button)] ml-3 group-hover:text-blue-500"
          size={24}
        />,
        <BiSolidDetail
          key="Clientes"
          className="text-[var(--secondary-button)] ml-3 group-hover:text-blue-500"
          size={24}
        />
      ]
    },
    {
      title: 'Stores Fotos',
      path: '/app/stores-fotos',
      icon: [
        <BiMobileAlt
          key="Clientes"
          className="text-[var(--button)] ml-3 group-hover:text-blue-500"
          size={24}
        />,
        <BiMobile
          key="Clientes"
          className="text-[var(--secondary-button)] ml-3 group-hover:text-blue-500"
          size={24}
        />
      ]
    },
    {
      title: 'Stores Videos',
      path: '/app/stores-videos',
      icon: [
        <BiMoviePlay
          key="Clientes"
          className="text-[var(--button)] ml-3 group-hover:text-blue-500"
          size={24}
        />,
        <BiSolidMoviePlay
          key="Clientes"
          className="text-[var(--secondary-button)] ml-3 group-hover:text-blue-500"
          size={24}
        />
      ]
    },
    {
      title: 'Lâminas de Apresentação',
      path: '/app/laminas-de-apresentacao',
      icon: [
        <BiNews
          key="Clientes"
          className="text-[var(--button)] ml-3 group-hover:text-blue-500"
          size={24}
        />,
        <BiSolidNews
          key="Clientes"
          className="text-[var(--secondary-button)] ml-3 group-hover:text-blue-500"
          size={24}
        />
      ]
    },
    {
      title: 'Stickers (Figurinhas)',
      path: '/app/stickers',
      icon: [
        <BiSticker
          key="Clientes"
          className="text-[var(--button)] ml-3 group-hover:text-blue-500"
          size={24}
        />,
        <BiSolidSticker
          key="Clientes"
          className="text-[var(--secondary-button)] ml-3 group-hover:text-blue-500"
          size={24}
        />
      ]
    },
    {
      title: 'Folder',
      path: '/app/folder',
      icon: [
        <BiCarousel
          key="Clientes"
          className="text-[var(--button)] ml-3 group-hover:text-blue-500"
          size={24}
        />,
        <BiSolidCarousel
          key="Clientes"
          className="text-[var(--secondary-button)] ml-3 group-hover:text-blue-500"
          size={24}
        />
      ]
    },
    {
      title: 'Reels',
      path: '/app/reels',
      icon: [
        <BiMoviePlay
          key="Clientes"
          className="text-[var(--button)] ml-3 group-hover:text-blue-500"
          size={24}
        />,
        <BiSolidMoviePlay
          key="Clientes"
          className="text-[var(--secondary-button)] ml-3 group-hover:text-blue-500"
          size={24}
        />
      ]
    },
    {
      title: 'Videos TV',
      path: '/app/videos-tv',
      icon: [
        <BiTv
          key="Clientes"
          className="text-[var(--button)] ml-3 group-hover:text-blue-500"
          size={24}
        />,
        <BiSolidTv
          key="Clientes"
          className="text-[var(--secondary-button)] ml-3 group-hover:text-blue-500"
          size={24}
        />
      ]
    },
    {
      title: 'Marca',
      path: '/app/marca',
      icon: [
        <BiRegistered
          key="planos"
          className="text-[var(--button)] ml-3 group-hover:text-blue-500"
          size={24}
        />,
        <BiSolidRegistered
          key="planos"
          className="text-[var(--secondary-button)] ml-3 group-hover:text-blue-500"
          size={24}
        />
      ]
    }
  ]
};
