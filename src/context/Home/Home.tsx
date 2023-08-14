import * as React from 'react';

import { motion } from 'framer-motion';
import Introduction from '@src/components/introduction/Introduction';

const Home: React.FC = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 1, ease: 'easeInOut' } },
    };
    
    return (
        <motion.section
        className="p-4 md:py-8 w-full bg-lightShade"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        >
        <div className="container items-center justify-between text-center md:text-left py-10 p-2 lg:mx-auto">
            <Introduction />
            <Introduction />
            <Introduction />


        </div>
        </motion.section>
    );
    }

export default Home;

