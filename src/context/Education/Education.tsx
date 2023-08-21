import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image'; // Impor next/image

import ITB from '@src/Assets/Images/ITB.png'; // Ubah jalur relatif sesuai dengan struktur direktori

const Education: React.FC = () => {
  return (
    <section id="education" className="w-screen bg-gradient-to-b from-white to-lightShade">
      <div className="p-16 container text-center md:text-left font-poppins">
        <h2 className="text-2xl md:text-4xl font-bold mb-4">Education</h2>
        <div className="flex flex-col items-center gap-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.5, duration: 1, ease: 'easeInOut' } }}
          >
            <Image
              src={ITB}
              alt="Logo Kampus"
              width={100} // Sesuaikan lebar gambar sesuai kebutuhan
              height={100} // Sesuaikan tinggi gambar sesuai kebutuhan
            />
          </motion.div>
          <div>
            <p className="text-xl font-semibold">Bandung Institute of Technology</p>
            <p className="text-lg">System and Information Technology</p>
            <p className="text-md">2021 - 2025</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;
