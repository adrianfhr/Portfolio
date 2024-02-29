import React, { useEffect, useState } from 'react';
import PWITB from '@src/Assets/images/PWITB.png'; 
import SRE from '@src/Assets/images/SREITB.png';
import Image from 'next/image';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';  
import Link from 'next/link';
import PQMS from '@src/Assets/Images/pqms.png';
import siBiru from '@src/Assets/Images/siBiru.png';

const Journey: React.FC = () => {
  const [slidesToShow, setSlidesToShow] = useState(3);
  
  useEffect(() => {
    const handleResize = () => {
      // Adjust the number of slides based on the screen width
      if (window.innerWidth < 768) {
        setSlidesToShow(1);
      } else if (window.innerWidth < 1024) {
        setSlidesToShow(2);
      } else if (window.innerWidth < 1440) {
        setSlidesToShow(3);
      } else{
        setSlidesToShow(4);
      }
    };

    // Initial adjustment and event listener
    handleResize();
    window.addEventListener('resize', handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const projectArray = [
         {
              Title: 'SRE ITB',
              Description: 'A website showcasing the profile of the Society Renewable Energy ITB and IYREF',
              image: SRE,
              github: 'https://github.com/adrianfhr',
              website: 'https://sreitb.com',
              tech: ['Next', 'React', 'Express', 'MySQL', 'Prisma']
            },
            {
              Title: 'Patient Queue Management System',
              Description: ' PQMS is a  Web-Based Application for monitoring patient queues in hospitals  and healthcare Services.',
              image: PQMS,
              github: 'https://pqms.com',
              website: null,
              tech: ['React', 'Node.js', 'MongoDB', 'Express']
            },
            {
              Title: 'siBiru ITB Shuttle Tracker',
              Description: ' SiBiru is the ITB shuttle tracking app providing real-time information on shuttle locations and arrival times at key points in the Institut Teknologi Bandung (ITB) Jatinangor',
              image: siBiru,
              github: 'https://github.com/username/project3',
              website: 'https://project3.example.com',
              tech: ['React', 'Node.js', 'MongoDB']
            },
            {
              Title: 'Perayaan Wisuda ITB April 2023',
              Description: 'A website showcasing information about the April 2023 graduation at ITB.',           

              image: PWITB,
              github: 'https://github.com/username/project4',
              website: 'https://project4.example.com',
              tech: ['React', 'Node.js', 'MongoDB']
            },
      ];
  
  const Setting = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: slidesToShow,
    slidesToScroll: 1
  };

  return (
    <section id="project" className=" min-h-screen bg-darkShade p-16 lg:p-32">
      <h2 className='text-4xl md:text-6xl font-poppins text-center font-extrabold text-lightShade mb-16'>A Glimpse of My Work</h2>
      <div className="justify-center">
        <Slider {...Setting} className='py-5 '>
          {projectArray.map((project, index) => (
            <div
            key={index}
            className=" h-[546px] rounded-3xl overflow-hidden duration-300 group border-2 my-8 text-white border-lightShade hover:bg-lightShade hover:text-slate-900"
          > 
            <div className='h-48 overflow-hidden border-b-2 border-lightShade'>
              <div className='bg-red-100 w-full'>
                <button className='p-2 absolute top-2 right-2'>
                  x
                </button>
              </div>
              <Image src={project.image} alt={project.Title} className='rounded-lg object-cover bg-white group-hover:scale-110 duration-300' />
            </div>
            <div className="p-4">
              <div className='h-16'>
                <h3 className="text-2xl font-bold my-2 ">{project.Title}</h3>
              </div>
              <div className=' h-36'>
                <p className="text-justify mt-8">{project.Description}</p>
              </div>
            </div>
            <div className='p-4'>
              <div className='flex justify-between w-full'>
                <div className=''>
                  <Link href={project.github} target="_blank" rel="noopener noreferrer" className="text-white hover:underline mr-4 hover:text-slate-900">
                    <FaGithub size={32} />
                  </Link>
                </div>
                <div className=''>
                  {
                    project.website && (
                      <Link href={project.website} target="_blank" rel="noopener noreferrer" className="text-white hover:underline hover:text-slate-900">
                        <FaExternalLinkAlt size={32} />
                      </Link>
                    )
                  }
                </div>
              </div>
            </div>
          </div>          
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default Journey;
