import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image'; // Impor next/image

import PWITB from '@src/Assets/Images/Parade-Wisuda-April.jpg'; 
import SRE from '@src/Assets/Images/SRE-ITB.png';
const Journey: React.FC = () => {

  const journeyArray = [
        {
            position: 'Staff of IT',
            organization: `Society Of Renewable Energy ITB`,
            period: 'June 2021 - Present',
            description: 'As a Staff of IT for the Society Of Renewable Energy ITB, I am responsible for developing and maintaining the backend infrastructure of the organization\'s technology platform. My role involves coordinating with cross-functional teams, overseeing the architecture and implementation of various backend systems, and ensuring the seamless flow of data and interactions between different components. During my tenure, I focused on optimizing performance, scalability, and security to provide a smooth and reliable experience for all participants and attendees. I also actively collaborated with frontend teams, designers, and other stakeholders to deliver a cohesive and impactful event platform.',
            image: SRE
        },
        {
            position: 'Head of Backend Engineering',
            organization: 'Parade Wisuda ITB April 2023',
            period: 'March 2023 - June 2023',
            description: 'As the Head of Backend Engineering for the Parade Wisuda ITB event, I led a team of talented engineers responsible for developing and maintaining the backend infrastructure of the event\'s technology platform. My role involved coordinating with cross-functional teams, overseeing the architecture and implementation of various backend systems, and ensuring the seamless flow of data and interactions between different components. During my tenure, I focused on optimizing performance, scalability, and security to provide a smooth and reliable experience for all participants and attendees. I also actively collaborated with frontend teams, designers, and other stakeholders to deliver a cohesive and impactful event platform.',
            image: PWITB
        }
        
    ];

    return (
        <section id="journey" className="w-screen p-16 ">
          <div className='flex flex-col items-center mb-20' >
            <h2 className=' md:text-4xl lg:text-6xl text-center border-b-4 border-lightAccent font-bold p-5 '>My Journey</h2>
          </div>
          <div className="overflow-hidden text-center md:text-left">
            {journeyArray.map((journey, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }} // Awal animasi
                animate={{ opacity: 1, y: 0 }} // Animasi yang diterapkan
                transition={{ duration: 0.5, delay: idx * 0.2 }} // Durasi dan penundaan animasi
                className='font-inter w-full flex flex-col md:flex-row md:px-16 lg:px-32 mb-10'
                key={idx}
              >
                <div className='p-2 flex flex-row md:flex- justify-center'>
                  <div className='my-5 md:my-0 rounded-lg overflow-hidden w-48 h-48 md:mr-16 bg-slate-100'>
                    <Image src={journey.image} alt="Logo Company" />
                  </div>
                </div>
                <div className='flex flex-col justify-center'>
                  <p className='text-2xl md:text-3xl my-2 font-bold'>{journey.position}</p>
                  <p className='text-xl md:text-2xl my-2 text-justify'>{journey.organization}</p>
                  <p className='text-md md:text-xl my-2 text-justify text-lightAccent'>{journey.period}</p>
                  <p className='text-md md:text-xl my-2 text-justify'>{journey.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      );
    };

export default Journey;
