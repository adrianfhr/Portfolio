import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const MENU_LIST = [
  {
    text: 'Home',
    href: '/',
  },
  {
    text: 'Skills',
    href: '/About',
  },
  {
    text: 'Experience',
    contents: [
      {
        text: 'Internal Program',
        href: '/activity/internal',
      },
      {
        text: 'External Program',
        href: '/activity/external',
      },
      {
        text: 'Learning Program',
        href: '/activity/learning',
      },
      {
        text: 'Project',
        href: '/activity/project',
      },
    ],
  },
  {
    text: 'Projects',
    href: '/',
  },
  {
    text: 'Contact Me',
    href: '/',
  },
];


  


const Navbar: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [scrollingDown, setScrollingDown] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);
  
    useEffect(() => {
      const handleScroll = () => {
        const currentScrollY = window.scrollY;
        setScrollingDown(currentScrollY > lastScrollY);
        setLastScrollY(currentScrollY);
      };
  
      window.addEventListener('scroll', handleScroll);
  
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, [lastScrollY]);
  
    const router = useRouter();
    const page = router.pathname.split('/')[1] || 'Home';
  
    return (
      <nav className={`w-full z-10 fixed inset-x-0 top-0  font-inter transition-transform duration-800  ${scrollingDown ? '-translate-y-full' : 'translate-y-0'}`}>
        <div className="container mx-auto md:w-[90%] lg:w-[70%] md:bg-lightAccent md:mt-10 md:rounded-full">
          <div className="md:flex md:justify-center items-center py-4 md:px-16">
            <div className="flex items-center space-x-4 justify-between">
                  <button
                    className={`${
                      open ? 'fixed right-0' : 'fixed right-0'
                    } right-0 top-0 mt-[32px] mr-[15px] z-50 flex flex-col w-10 h-6 justify-between cursor-pointer md:hidden`}
                    onClick={() => {
                      setOpen(!open)
                    }}>
                    <span
                      className={`h-1 w-6 bg-white rounded-lg transform transition duration-300 ease-in-out ${
                        open ? 'w-7 bg-white rotate-45 translate-y-2.5' : ''
                      }`}
                    />
                    <span
                      className={`h-1 w-6 bg-white rounded-lg transition-all duration-300 ease-in-out ${
                        open ? 'h-0 opacity-0' : 'w-6'
                      }`}
                    />
                    <span
                      className={`h-1 w-6 bg-white rounded-lg transform transition duration-300 ease-in-out ${
                        open ? 'w-7 bg-white -rotate-45 -translate-y-2.5' : ''
                      }`}
                    />
              </button>
            </div>
            <div className="hidden md:flex space-x-4">
              {MENU_LIST.map((menu, idx) => (
                <div
                  key={idx}
                  className={`relative inline-flex cursor-pointer ${
                    (idx === 0 && page === 'Home') ||
                    (idx === 1 && page === 'About')
                      ? 'border-b-2 border-white'
                      : ''
                  }`}
                >
                  <a
                    href={menu.href}
                    className="inline-block px-4 py-2 text-lightShade hover:opacity-80"
                  >
                    {menu.text}
                  </a>
                </div>
              ))}
            </div>
          </div>
          
          { open && (
            <div
                className={`bg-lightAccent md:hidden h-screen w-screen fixed top-0 left-0`}
            >
                <ul className="space-y-1 p-4">
                {MENU_LIST.map((menu, idx) => (
                    <li key={idx}>
                      <a
                        href={menu.href}
                        className={`block px-4 py-2 text-white hover:bg-blue-300 ${
                          (idx === 0 && page === 'Home') || (idx === 1 && page === 'About')
                            ? 'font-bold'
                            : ''
                        } flex items-center justify-center h-full my-auto`}
                      >
                        <span className="flex items-center justify-center h-full">{menu.text}</span>
                      </a>

                    </li>
                ))}
                </ul>
            </div>
            )}
        </div>
      </nav>
    );
  };
  
  export default Navbar;
  