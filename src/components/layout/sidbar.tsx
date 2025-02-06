import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { users } from '@prisma/client';
import { menu } from './menu';
import Image from 'next/image';
type Props = {
  sidebarOpen: boolean;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
  isMobile: boolean;
  user: users | undefined;
};

export default function Sidebar({
  isMobile,
  setSidebarOpen,
  sidebarOpen,
  user
}: Props) {
  const pathname = usePathname();
  const [location, setLocation] = useState(pathname);
  useEffect(() => {
    setLocation(pathname);
  }, [pathname]);
  return (
    <main className="fixed top-0 right-0 h-full z-40">
      <div
        {...(!isMobile && {
          onMouseLeave: () => setSidebarOpen(false),
          onMouseEnter: () => setSidebarOpen(true)
        })}
        className={`${
          sidebarOpen && 'w-72'
        } ${!sidebarOpen && !isMobile && 'w-16'} 
        ${!sidebarOpen && isMobile && 'w-0'} w-0 fixed left-0 h-screen bg-white shadow-md transition-all duration-300 z-20 flex flex-col justify-between overflow-hidden`}
      >
        <div className="flex flex-col">
          <div className="flex justify-center items-center h-16 border-b border-gray-200">
            <span className="text-xl font-bold">
              {sidebarOpen ? (
                <Image
                  src={'/logo.png'}
                  width={115}
                  height={52.55}
                  alt="Logo"
                  priority
                />
              ) : (
                <Image
                  className="w-auto h-auto"
                  src={'/icone.png'}
                  width={30}
                  height={30}
                  alt="Logo"
                  priority
                />
              )}
            </span>
          </div>
          <nav className="flex-1 mt-4 ">
            <ul
              className={`${!sidebarOpen && 'overflow-y-hidden'} space-y-2 overflow-x-hidden h-[calc(100vh-12.5rem)]`}
            >
              {user?.type === 1 &&
                menu.user.map((item, index) => (
                  <li
                    key={index}
                    className="py-2 pr-2 pl-2"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <div
                      className={`${location == item.path && 'bg-slate-200'} flex items-center  rounded-lg hover:bg-gray-100 transition-colors duration-300`}
                    >
                      <Link className="flex items-center py-2" href={item.path}>
                        <div>
                          {location == item.path ? item.icon[1] : item.icon[0]}
                        </div>
                        <span
                          className={`ml-4 text-gray-700 group-hover:text-blue-500 transition-opacity duration-300 text-nowrap text-ellipsis ${
                            sidebarOpen ? 'opacity-100' : 'opacity-0 invisible'
                          }`}
                        >
                          {item.title}
                        </span>
                      </Link>
                    </div>
                  </li>
                ))}
              {user?.type === 2 &&
                menu.desing.map((item, index) => (
                  <li
                    key={index}
                    className="py-2 pr-2 pl-2"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <div
                      className={`${location == item.path && 'bg-slate-200'} flex items-center  rounded-lg hover:bg-gray-100 transition-colors duration-300`}
                    >
                      <Link className="flex items-center py-2" href={item.path}>
                        <div>
                          {location == item.path ? item.icon[1] : item.icon[0]}
                        </div>
                        <span
                          className={`ml-4 text-gray-700 group-hover:text-blue-500 transition-opacity duration-300 text-nowrap text-ellipsis ${
                            sidebarOpen ? 'opacity-100' : 'opacity-0 invisible'
                          }`}
                        >
                          {item.title}
                        </span>
                      </Link>
                    </div>
                  </li>
                ))}
            </ul>
          </nav>
        </div>
        <div className="flex items-center justify-center h-16 border-t border-gray-200">
          <span>{sidebarOpen ? '© 2024' : '©'}</span>
        </div>
      </div>
      {sidebarOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black opacity-30 z-10"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </main>
  );
}
