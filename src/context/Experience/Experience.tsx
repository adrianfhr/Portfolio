import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image'; // Impor next/image
import PWITB from '@src/assets/Images/PWITB.png'
import SRE from '@src/assets/Images/SREITB.png';
import {IoIosArrowForward } from 'react-icons/io'; 

const Experience: React.FC = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleDropdown = (index: number) => {
    setExpandedIndex((prevIndex) => (prevIndex === index ? null : index));
  };
  
  const ExperienceArray = [
        {
            position: 'Staff of IT',
            organization: `Society Of Renewable Energy ITB`,
            period: 'June 2021 - Present',
            description: [
                "Developed and maintained RESTful APIs, handling frontend requests to ensure smooth communication between frontend and backend systems.",
                "Responsible for database modelling and management using MySQL, ensuring data integrity and optimized query performance.",
                "Managed end-to-end deployment processes using cPanel, ensuring efficient and error-free deployment of web applications."
            ],
            image: SRE
        },
        {
            position: 'Head of Backend Engineering',
            organization: 'Parade Wisuda ITB April 2023',
            period: 'March 2023 - June 2023',
            description: [
              "Responsible for overseeing a team of 9 member backend engineers, ensuring the timely delivery of high-quality backend services.",
                "Configured and maintained deployment processes, server settings, file permissions, and databases via cPanel interface for optimal application performance"
                
            ],
            image: PWITB
        }
        
    ];

    return (
        <section id="experience" className="h-auto bg-darkShade py-28 text-white">
          <div className='flex flex-col items-center mb-20' >
            <h2 className='text-4xl lg:text-6xl text-center border-b-4 border-lightShade font-bold p-5 '>My Experience</h2>
          </div>
          <div className="overflow-hidden text-center  md:text-left">
            {ExperienceArray.map((Experience, idx) => (
              <motion.button
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.5, duration: 1, ease: 'easeInOut' } }}
                className='font-inter flex flex-col md:flex-row px-16 lg:px-32 mb-10 w-full'
                key={idx}
                onClick={() => toggleDropdown(idx)}
              >
                <div className='p-2 flex flex-row md:flex justify-center'>
                  <div className='my-5 md:my-0 rounded-lg overflow-hidden w-36 h-28 md:mr-16 bg-slate-100'>
                    <Image src={Experience.image} alt="Logo Company" className='object-cover'/>
                  </div>
                </div>
                <div className='flex flex-col justify-center'>
                  <p className='text-2xl md:text-3xl my-2 font-bold text-left'>{Experience.position}</p>
                  <p className='text-xl md:text-2xl my-2 text-justify'>{Experience.organization}</p>
                  <p className='text-md md:text-xl my-2 text-justify text-lightAccent'>{Experience.period}</p>
                  <div className='text-md md:text-xl my-2 text-justify'>
                    {expandedIndex === idx && (
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20, transition: { duration: 1 } }}
                        transition={{ duration: 1, ease: 'easeInOut' }}
                      className='flex flex-col'>
                        {Experience.description.map((desc, idx) => (
                          <div key={idx} className='flex'>
                            <IoIosArrowForward size={30} className='my-3 mr-3' />
                            <p  className='my-2'>{desc}</p>
                          </div>
                        ))}
                      </motion.div>
                    )}  
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </section>
      );
    };

    
export default Experience;
