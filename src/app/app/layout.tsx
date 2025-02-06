'use client';
import { RiMenuFill } from 'react-icons/ri';
import { useEffect, useState } from 'react';
//import Loading from '@/app/loading';
import { users } from '@prisma/client';
import Sidebar from '@/components/layout/sidbar';
import { getUserByToken } from '@/service/user-service';
import {
  Avatar,
  Box,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip
} from '@mui/material';
import { Settings, Logout } from '@mui/icons-material';
import Link from 'next/link';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  //const [isClient, setIsClient] = useState(false);
  const [user, setUser] = useState<users | undefined>();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

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
          className="md:hidden ml-4"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <RiMenuFill size={24} />
        </button>
        <div className="flex items-center justify-end w-full mr-4">
          <Box
            sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}
          >
            <Tooltip title="Account settings">
              <IconButton
                onClick={handleClick}
                size="small"
                sx={{ ml: 2 }}
                aria-controls={open ? 'account-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
              >
                <Avatar sx={{ width: 36, height: 36 }}>
                  {user?.name.split('')[0]}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            slotProps={{
              paper: {
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                  mt: 1.5,
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1
                  },
                  '&::before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0
                  }
                }
              }
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              <Link href={'/app/user/perfil'}>Perfil</Link>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              <Link href={'/'}>Sair</Link>
            </MenuItem>
          </Menu>
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
