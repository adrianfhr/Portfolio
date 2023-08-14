import * as React from 'react';
import { motion } from 'framer-motion';

const Education: React.FC = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 1, ease: 'easeInOut' } },
    };
    
    return (
        <section id="education" className=" h-screen w-screen bg-lightShade ">
        <motion.div
            className="p-8 z-1 h-full w-full flex flex-row lg:flex-row justify-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className=" w-full p-8 mx-4 container items-center justify-between text-center md:flex md:text-left">
            <motion.div
                className="w-full"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0, transition: { delay: 0, duration: 0.8, ease: 'easeInOut' } }}
            >
                <motion.h1 className="text-2xl md:text-4xl  font-bold mb-4">
                Education
                </motion.h1>
                
            </motion.div>
            
            </div>
        </motion.div>
        </section>
    );
}

export default Education;