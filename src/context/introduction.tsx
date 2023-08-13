import React from 'react';
import { motion } from 'framer-motion';

const Introduction: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1, ease: 'easeInOut' } },
  };

  return (
    <motion.section
      className="p-4 my-10 md:py-8 w-screen"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container items-center justify-between text-center md:flex lg:text-left py-10 p-2">
        <div className="w-full lg:w-1/2 lg:px-8 lg:mx-9">
          <motion.h1
            className="text-2xl md:text-4xl lg:text-4xl font-bold mb-4"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { delay: 0.5, duration: 0.8, ease: 'easeOut' } }}
          >
            Hi, I'm Drian!
          </motion.h1>
          <motion.p
            className="text-sm md:text-base lg:text-m text-slate-500"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { delay: 0.7, duration: 0.8, ease: 'easeOut' } }}
          >
            I am <span className='text-blue-500'>Software Engineer</span>, a student at the Bandung Institute of Technology (ITB),
            majoring in Information Systems and Technology. I have a strong enthusiasm for software development and am
            determined to create innovative technological solutions.
          </motion.p>
        </div>
        <div className="w-1/2">
          <motion.img
            src={"https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg"}
            alt="Gambar Saya"
            className="rounded-full w-32 md:w-48 lg:w-64 h-32 md:h-48 lg:h-64 mx-auto my-10"
            initial={{ scale: 0 }}
            animate={{ scale: 1, transition: { delay: 1, duration: 1, ease: 'easeInOut' } }}
          />
        </div>
      </div>
    </motion.section>
  );
};

export default Introduction;
