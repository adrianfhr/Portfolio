import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Man from '@src/Assets/Images/man-introduction.png';
import Image from 'next/image';
import backgroundImage from '@src/Assets/Images/bg-blue-2.png';


const Introduction: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1, ease: 'easeInOut' } },
  };

  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.5,
  });

  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    if (inView) {
      setIsAnimated(true);
    } else {
      setIsAnimated(false);
    }
  }, [inView]);


  return (
    <section id="home" className="w-screen font-inter">
      <motion.div
        className="p-16 lg:p-32 z-1 h-full w-full flex flex-col lg:flex-row justify-center my-16"
        variants={containerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        ref={ref}
      >
        <div className=" w-full container items-center justify-between text-center md:flex md:text-left ">
          <motion.div
            className="w-full md:pl-16 md:border-l-8 md:border-darkAccent "
            initial={{ opacity: 0, x: -20 }}
            animate={
              isAnimated
                ? { opacity: 1, x: 0, transition: { delay: 0, duration: 0.8, ease: 'easeInOut' } }
                : {transition: { delay: 0, duration: 0.8, ease: 'easeInOut' }}
            }
          >
            <motion.h1 className="text-2xl md:text-4xl  font-bold mb-4">
              Hi, I'm Drian!
            </motion.h1>
            <motion.p className="text-sm md:text-base lg:text-3xl text-darkShade text-justify">
              I am <span className='text-darkAccent'>Software Engineer</span>, a student at the Bandung Institute of Technology (ITB),
              majoring in Information Systems and Technology. I have a strong enthusiasm for software development and am
              determined to create innovative technological solutions.
            </motion.p>
            <div className="mt-4 flex flex-col md:flex-row items-center gap-2 md:text-2xl">
              <motion.button
                className="bg-darkShade hover:bg-darkAccent text-white py-2 px-4 rounded-md mb-2 "
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                My Resume
              </motion.button>
              <motion.button
                className=" text-darkShade hover:text-blue-500 py-2 px-4 rounded-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Me
              </motion.button>
            </div>
          </motion.div>
          <motion.div
            className="w-full mt-4 ml-32 hidden md:block  "
            initial={{ opacity: 0, scale: 0 }}
            animate={
              isAnimated
                ? { opacity: 1, scale: 1, transition: { delay: 0.5, duration: 1, ease: 'easeInOut' } }
                : {transition: { delay: 0, duration: 0.8, ease: 'easeInOut' }}
            }
          >
            <div className="relative bg-cover bg-center bg-no-repeat">
            <Image src={Man} alt="saya" className='mx-auto my-auto absolute inset-0' />
            <Image src={backgroundImage} alt="bg" className='mx-auto w-full' />
            </div>
          </motion.div>            
        </div>
      </motion.div>
    </section>
  );
};

export default Introduction;
