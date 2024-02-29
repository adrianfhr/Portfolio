import React from 'react';
import Image from 'next/image';
import { MdWavingHand } from "react-icons/md";
import { FaWhatsapp, FaGithub, FaEnvelope, FaLinkedin, FaArrowDown} from 'react-icons/fa';
import Programmer from '@src/Assets/Images/programmer.png';
import Link from 'next/link';

const Home: React.FC = () => {

  return (
    <section id="home" className="font-poppins min-h-screen bg-darkShade text-white p-8">
      <div className='z-1 h-full w-full flex flex-col md:flex-row-reverse md:pt-40 justify-center px-8 items-center'>
        <div className='md:w-1/3'>
          <Image src={Programmer} alt="Programmer" />
        </div>
        <div className='flex flex-col items-center text-center lg:items-start ml-4'>
          <h1 className="flex text-2xl md:text-6xl font-bold mb-4 md:text-left">
            Hi, I&apos;m Adrian
            <MdWavingHand className="text-4xl md:text-6xl ml-4" color='#FFDAB9 '/>
          </h1>
          <h1 className="text-3xl font-extrabold mb-4 text-lightShade md:text-left">
            An Information Systems and Technology Student
          </h1>
          <h2 className="text-2xl text-lightAccent md:text-left">
            at Bandung Institute of Technology
          </h2>
          {/* Social Icons */}
          <div className='flex mt-4'>
            <Link href="https://wa.me/6281315080434" target="_blank" rel="noopener noreferrer" className="mr-4 p-2 rounded-full hover:bg-lightShade hover:text-black">
              <FaWhatsapp size={32} />
            </Link>
            <Link href="https://github.com/adrianfhr" target="_blank" rel="noopener noreferrer" className="mr-4 p-2 rounded-full hover:bg-lightShade hover:text-black">
              <FaGithub size={32}/>
            </Link>
            <Link href="mailto:adrianfhrr@gmail.com" className="mr-4 p-2 rounded-full hover:bg-lightShade hover:text-black">
              <FaEnvelope size={32}/>
            </Link>
            <Link href="https://www.linkedin.com/in/adrianfhr" target="_blank" rel="noopener noreferrer" className='mr-4 p-2 rounded-full hover:bg-lightShade hover:text-black'>
              <FaLinkedin size={32}/>
            </Link>
          </div>
          <div className="mt-8 flex">
            <button
              onClick={(e) => {
                e.preventDefault(); // Prevent the default behavior of anchor tags
                const targetSection = document.querySelector("#about");
                if (targetSection) {
                  targetSection.scrollIntoView({
                    behavior: 'smooth',
                  });
                }
              }}
             className="bg-white text-darkShade py-2 px-8 rounded-md hover:bg-lightShade">About Me</button>
            <button
              onClick={(e) => {
                e.preventDefault(); // Prevent the default behavior of anchor tags
                const targetSection = document.querySelector("#contact");
                if (targetSection) {
                  targetSection.scrollIntoView({
                    behavior: 'smooth',
                  });
                }
              }} className=" text-white py-2 px-8 hover:text-lightShade">Contact Me</button>
          </div>
        </div>
      </div>
      <div className="w-full rounded-full mt-10 hidden md:flex justify-center items-center">
        <button
         title='Scroll down'
         onClick={(e) => {
            e.preventDefault(); // Prevent the default behavior of anchor tags
            const targetSection = document.querySelector("#about");
            if (targetSection) {
              targetSection.scrollIntoView({
                behavior: 'smooth',
              });
            }
          }}
         className="flex justify-center items-center">
          <div className='bg-white rounded-full p-2 group hover:bg-lightAccent hover:transform hover:scale-110 duration-300'>
            <FaArrowDown size={18} className="text-lightAccent group-hover:text-lightShade "/>
          </div>
        </button>
      </div>
    </section>
  );
};

export default Home;
