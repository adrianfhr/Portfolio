import React from 'react';
import { MdEmail } from "react-icons/md";
import { FaHandPointRight,FaLinkedin } from "react-icons/fa";
import { FaMapLocationDot } from "react-icons/fa6";
import Link from 'next/link';

const Contact = () => {
  return (
    <section id='contact' className="h-screen font-poppins bg-darkShade py-36 px-20">
            <h2 className='text-4xl md:text-6xl  text-center font-extrabold text-lightShade '>Let&lsquo;s Connect!</h2>

        <div className='flex items-center h-full justify-center'>
            <div className='md:flex'>
                <div className='flex w-full justify-center lg:ml-20'>
                    <div>
                        <div className='flex'>
                            <h3 className='text-2xl font-extrabold text-lightShade mb-4 mr-4'>Feel free to reach out.</h3>
                            <FaHandPointRight size={40} className='text-white hidden md:block'/>
                        </div>
                        <p className='text-lightShade mb-4 text-justify'>I&apos;m actively exploring new opportunities and would love to hear from you. Whether you have inquiries or just want to drop a friendly &lsquo;hello, I&apos;m here!&lsquo;</p>
                    </div>
                </div>
                <div className='w-full flex justify-center mt-8 md:mt-0'>
                    <div className=''>
                        <div className='flex text-lightShade'>
                            <Link href={'https://maps.app.goo.gl/5C8co22nfkGGHFBm7'} target="_blank" rel="noopener noreferrer">
                                <FaMapLocationDot size={40}/>
                            </Link>
                            <div>
                                <h3 className='text-2xl font-extrabold text-lightShade ml-4'>Location</h3>
                                <p className='text-xs font-extrabold text-lightShade mb-4 ml-4'>Bandung, Indonesia</p>
                            </div>
                        </div>
                        <div className='flex text-lightShade'>
                            <Link href={'mailto:adrianfhrr@gmail.com'} target="_blank" rel="noopener noreferrer">
                                <MdEmail size={40}/>
                            </Link>
                            <div>
                                <h3 className='text-2xl font-extrabold text-lightShade ml-4'>Email</h3>
                                <p className='text-xs font-extrabold text-lightShade mb-4 ml-4'>adrianfhrr@gmail.com</p>
                            </div>
                        </div>
                        <div className='flex text-lightShade'>
                            <Link href={'https://www.linkedin.com/in/adrianfhr'} target="_blank" rel="noopener noreferrer">
                                <FaLinkedin size={40}/>
                            </Link>
                            <div>
                                <h3 className='text-2xl font-extrabold text-lightShade ml-4'>LinkedIn</h3>
                                <p className='text-xs font-extrabold text-lightShade mb-4 ml-4'>adrianfhr</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </section>
  );
};

export default Contact;
