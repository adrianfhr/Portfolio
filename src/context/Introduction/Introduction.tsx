import React from 'react';
import Drian from '@src/Assets/Images/drian.png';
import Image from 'next/image';
import { TbDownload } from "react-icons/tb";
import Link from 'next/link';

const Introduction: React.FC = () => {

  return (
    <section id="about" className="font-poppins min-h-screen bg-darkShade text-white py-32 px-20 ">
        <div className='md:flex md:items-center h-full'>
            <div className='flex justify-center m-10 my-10 md:my-0 md:w-full '>  
              <div className=" overflow-hidden border-b-2 border-lightShade">
                <Image src={Drian} alt="Drian" className="object-cover w-full" />
              </div>
            </div>
            <div className='w-full p-8' >
              <h1 className="text-2xl md:text-4xl text-center md:text-left font-bold mb-4 text-lightShade">
                Adrian Fahri Affandi
              </h1>
              <p className="text-sm md:text-base lg:text-xl  text-justify">
                I am <span className='text-lightShade'>Software Engineer</span>, a student at the Bandung Institute of Technology (ITB),
                majoring in Information Systems and Technology. I have a strong enthusiasm for software development and am
                determined to create innovative technological solutions.
              </p>
              <div className="mt-8 flex flex-col md:flex-row items-center gap-2 md:text-xl">
                <Link href='/CV_AdrianFahriAffandi_KP.pdf'>
                  <button
                    className="flex bg-lightShade hover:bg-lightAccent hover:text-lightShade text-black py-2 px-4 rounded-md "
                    >
                    My Resume <TbDownload className='ml-2 m-1'/>
                  </button>
                </Link>
              </div>
            </div>
      </div>
    </section>
  );
}

export default Introduction;

