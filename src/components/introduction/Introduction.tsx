import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

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
    <motion.section
      className="p-4 my-10 md:py-8 w-screen z-1"
      variants={containerVariants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      ref={ref}
    >
      <div className="container items-center justify-between text-center md:flex md:text-left py-10 p-2 lg:mx-auto">
        <motion.div
          className="w-full"
          initial={{ opacity: 0, x: -20 }}
          animate={
            isAnimated
              ? { opacity: 1, x: 0, transition: { delay: 0, duration: 0.8, ease: 'easeInOut' } }
              : {transition: { delay: 0, duration: 0.8, ease: 'easeInOut' }}
          }
        >
          <motion.h1 className="text-2xl md:text-4xl lg:text-4xl font-bold mb-4">
            Hi, I'm Drian!
          </motion.h1>
          <motion.p className="text-sm md:text-base lg:text-2xl text-darkShade text-justify">
            I am <span className='text-blue-500'>Software Engineer</span>, a student at the Bandung Institute of Technology (ITB),
            majoring in Information Systems and Technology. I have a strong enthusiasm for software development and am
            determined to create innovative technological solutions.
          </motion.p>
          <div className="mt-4 flex flex-col md:flex-row items-center gap-2">
            <motion.button
              className="bg-lightAccent hover:bg-darkAccent text-white py-2 px-4 rounded-md mb-2 "
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              My Resume
            </motion.button>
            <motion.button
              className=" text-gray-700 hover:text-blue-500 py-2 px-4 rounded-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Contact Me
            </motion.button>
          </div>
        </motion.div>
        <motion.div
          className="w-full mt-4"
          initial={{ opacity: 0, scale: 0 }}
          animate={
            isAnimated
              ? { opacity: 1, scale: 1, transition: { delay: 0.5, duration: 1, ease: 'easeInOut' } }
              : {transition: { delay: 0, duration: 0.8, ease: 'easeInOut' }}
          }
        >
          <motion.img
            src={"https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg"}
            alt="Gambar Saya"
            className="rounded-full w-32 md:w-48 lg:w-64 h-32 md:h-48 lg:h-64 mx-auto my-10"
          />
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Introduction;
