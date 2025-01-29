'use client';
import { RiMenuFill } from 'react-icons/ri';
import { useEffect, useState } from 'react';
//import Loading from '@/app/loading';
import { users } from '@prisma/client';
import Sidebar from '@/components/layout/sidbar';
import { getUserByToken } from '@/service/user-service';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  //const [isClient, setIsClient] = useState(false);
  const [user, setUser] = useState<users | undefined>();

  const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
  };

  useEffect(() => {
    const getUserToken = async () => {
      const user = await getUserByToken();
      setUser(user);
    };
    getUserToken();
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize();
    //setIsClient(true);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  //if (!isClient) return <Loading />;
  return (
    <div className="h-screen overflow-hidden">
      <div className="w-full z-20 h-16 bg-[var(--background)] fixed"></div>
      <div
        className={`fixed mt-4 h-12 z-30 mt-30 shadow-lg right-3
        ${!isMobile ? 'max-w-[calc(100vw_-_7rem)]' : 'max-w-[calc(100vw_-_3rem)]'} w-[94%]`}
      ></div>
      <header
        className={`
        h-16 z-40 flex fixed justify-between items-center 
        bg-white mt-4 border-t border-x rounded-t-2xl right-3 overflow-hidden
        ${!isMobile ? 'max-w-[calc(100vw_-_6rem)]' : 'max-w-[calc(100vw_-_1.5rem)]'} w-[95%]
        `}
      >
        <button
          className="md:hidden"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <RiMenuFill size={24} />
        </button>
        <div className="ml-auto">
          <h2>Perfil</h2>
        </div>
      </header>
      <Sidebar
        isMobile={isMobile}
        setSidebarOpen={setSidebarOpen}
        sidebarOpen={sidebarOpen}
        user={user}
      />
      <main
        className={`flex-1 z-10 transition-all duration-300 overflow-hidden mt-14
        ${!isMobile ? 'ml-16' : 'ml-0'} w-full`}
      >
        <div
          className={`min-h-[calc(100vh_-_6rem)] mt-4 border shadow-lg overflow-hidden right-3 bg-white rounded-b-2xl absolute 
            ${!isMobile ? 'max-w-[calc(100vw_-_6rem)]' : 'max-w-[calc(100vw_-_1.5rem)]'} w-[95%] p-4`}
        >
          {children}
        </div>
      </main>
    </div>
  );
}
