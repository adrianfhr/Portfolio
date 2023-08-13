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
      <nav className={`z-100 fixed inset-x-0 top-0  font-inter transition-transform duration-300 ${scrollingDown ? '-translate-y-full' : 'translate-y-0'} `}>
        <div className="container mx-auto lg:w-[70%] bg-slate-300  lg:mt-10 lg:rounded-full shadow-xl">
          <div className="lg:flex lg:justify-center items-center py-4 px-6 lg:px-16">
            <div className="flex items-center space-x-4 justify-between">
              <div className="text-white font-bold text-xl lg:hidden">Adrian Fahri Affandi</div>
              <button
                className="lg:hidden px-2 py-1 text-white "
                onClick={() => setOpen(!open)}
              >
                Menu
              </button>
            </div>
            <div className="hidden lg:flex space-x-4">
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
                    className="inline-block px-4 py-2 text-slate-400 hover:opacity-80"
                  >
                    {menu.text}
                  </a>
                </div>
              ))}
            </div>
          </div>
          
          { open && (
            <div
                className={`bg-blue-200 lg:hidden `}
            >
                <ul className="space-y-1 p-4">
                {MENU_LIST.map((menu, idx) => (
                    <li key={idx}>
                    <a
                        href={menu.href}
                        className={`block px-4 py-2 text-white hover:bg-blue-300 ${
                        (idx === 0 && page === 'Home') ||
                        (idx === 1 && page === 'About')
                            ? 'font-bold'
                            : ''
                        }`}
                    >
                        {menu.text}
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
  