import {
  BiBookmarkHeart,
  BiCalendarStar,
  BiChalkboard,
  BiHomeHeart,
  BiMoviePlay,
  BiRegistered,
  BiSolidBookmarkHeart,
  BiSolidCalendarStar,
  BiSolidChalkboard,
  BiSolidHomeHeart,
  BiSolidMoviePlay,
  BiSolidRegistered,
  BiSolidTv,
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
        <BiCalendarStar
          key="Clientes"
          className="text-[var(--button)] ml-3 group-hover:text-blue-500"
          size={24}
        />,
        <BiSolidCalendarStar
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
        <BiCalendarStar
          key="Clientes"
          className="text-[var(--button)] ml-3 group-hover:text-blue-500"
          size={24}
        />,
        <BiSolidCalendarStar
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
