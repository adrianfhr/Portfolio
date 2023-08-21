import React from 'react';
import { motion } from 'framer-motion';
import PWITB from '@src/Assets/Images/Parade-Wisuda-April.jpg'; 
import SRE from '@src/Assets/Images/SRE-ITB.png';
import Image from 'next/image';

const Journey: React.FC = () => {

    const projectArray = [
      {
        Title: 'SRE ITB',
        Description: 'SRE ITB is an organization that focuses on renewable energy...',
        image: SRE,
        github: 'https://github.com/adrianfhr',
        website: 'https://sre-itb.org/'
      },
      {
        Title: 'Project 2',
        Description: 'Description for Project 2...',
        image: PWITB,
        github: 'https://github.com/username/project2',
        website: 'https://project2.example.com'
      },
      {
        Title: 'Project 3',
        Description: 'Description for Project 3aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        image: PWITB,
        github: 'https://github.com/username/project3',
        website: 'https://project3.example.com'
      },
      {
        Title: 'Project 4',
        Description: 'Description for Project 4...',
        image: PWITB,
        github: 'https://github.com/username/project4',
        website: 'https://project4.example.com'
      },
      {
        Title: 'Project 5',
        Description: 'Description for Project 5...',
        image: PWITB,
        github: 'https://github.com/username/project5',
        website: 'https://project5.example.com'
      }
    ];
  

  return (
    <section id="project" className="w-screen  bg-darkBlue p-16 lg:p-32  ">
      <h2 className='text-6xl text-center font-bold text-lightShade mb-16'>My Project</h2>
      <div className="flex flex-wrap justify-center ">
        {projectArray.map((project, index) => (
          <motion.div
            key={index}
            className="flex flex-col flex-wrap mx-8 my-8 w-[297px] bg-white p-4 rounded-lg shadow-lg group hover:shadow-xl transition-shadow duration-300 ease-in-out"
            whileHover={{ scale: 1.05 }}
            >
            <div className="flex justify-center mb-2">
              <div className='rounded-lg overflow-hidden w-48 h-48  bg-slate-100  duration-300  group-hover:translate-y-[-40px]'>
                <Image src={project.image} alt={project.Title} />
              </div>
            </div>
            <div className='x-8'>
              <h3 className="text-lg font-semibol d mt-2">{project.Title}</h3>
              <p className="text-sm text-gray-500 mt-2">{project.Description}</p>
              <div className="flex justify-between mt-4">
                <a href={project.github} className="text-blue-500 hover:scale-105">
                <img width="42" height="42" src="https://img.icons8.com/sf-black-filled/64/000000/github.png" alt="github"/>
                </a>
                <a href={project.website} className="text-blue-500 hover:underline hover:scale-105">
                <img width="38" height="38" src="https://img.icons8.com/pulsar-line/48/external-link-squared.png" alt="external-link-squared"/>
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Journey;
