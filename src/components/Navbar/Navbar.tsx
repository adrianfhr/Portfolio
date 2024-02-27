import { useEffect, useState } from 'react';
import { IoHome, IoBusiness, IoDocuments, IoCall } from 'react-icons/io5';

const MENU_LIST = [
  { text: 'Home', href: '#home' },
  { text: 'Experience', href: '#experience' },
  { text: 'Project', href: '#project' },
  { text: 'Contact', href: '#contact' },
];

const Navbar: React.FC = () => {
  const [activeSection, setActiveSection] = useState('home');

  const observeSection = (sectionId: string) => {

    const section = document.getElementById(sectionId);
    if (section) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              console.log(`Section ${sectionId} is in view!`);
              setActiveSection(sectionId);
            }
          });
        },
        { threshold: 0.5 } // You can adjust the threshold as needed
      );

      observer.observe(section);

      return () => {
        observer.unobserve(section);
      };
    }
  };

  useEffect(() => {
    observeSection('home');
    observeSection('experience');
    observeSection('project');
    observeSection('contact');
  }, []);

  const handleMenuClick = (e: React.MouseEvent, menu: { text: string, href: string }) => {
    e.preventDefault();
    const targetSection = document.querySelector(menu.href);
    if (targetSection) {
      targetSection.scrollIntoView({
        behavior: 'smooth',
      });
      setActiveSection(menu.text.toLowerCase());
    }
  };

  return (
    <div className="z-10 fixed w-screen md:h-10 bottom-0 md:top-0 font-inter transition-transform duration-800">
      <div className="mx-auto w-[90%] lg:w-[40%] bg-darkShade my-5 rounded-full shadow-lightShade shadow-2xl">
        <div className="flex justify-center items-center py-4 :px-16">
          <div className="flex space-x-4 py-2">
            {MENU_LIST.map((menu) => (
              (activeSection === menu.text.toLowerCase() ? (
                <div
                  key={menu.text}
                  className="border-b-2 border-double border-spacing-2 border-lightShade"
                >
                  <a
                    href={menu.href}
                    className="inline-block px-4 py-2 text-lightShade hover:opacity-80"
                    onClick={(e) => handleMenuClick(e, menu)}
                  >
                    {
                      menu.text === 'Home' ? <IoHome size={24} /> :
                      menu.text === 'Experience' ? <IoBusiness size={24} /> :
                      menu.text === 'Project' ? <IoDocuments size={24} /> :
                      menu.text === 'Contact' ? <IoCall size={24}/> : menu.text
                    }
                  </a>
                </div>
              ) : (
                <div
                  key={menu.text}
                >
                  <a
                    href={menu.href}
                    className="inline-block px-4 py-2 text-lightShade hover:opacity-80"
                    onClick={(e) => handleMenuClick(e, menu)}
                  >
                    {
                      menu.text === 'Home' ? <IoHome size={24} /> :
                      menu.text === 'Experience' ? <IoBusiness size={24} /> :
                      menu.text === 'Project' ? <IoDocuments size={24} /> :
                      menu.text === 'Contact' ? <IoCall size={24}/> : menu.text
                    }
                  </a>
                </div>
              ))
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
