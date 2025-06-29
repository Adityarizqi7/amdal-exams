import { Link } from 'react-router-dom'

import klh from '../../assets/images/klh-long.png'
import amdalnet from '../../assets/images/amdalnet.png'

export default function Footer() {
    
    return (
        <footer
            className="montserrat bg-cover bg-no-repeat bg-white relative z-10"
        >
            {/* <hr className='mb-6 sm:mx-auto lg:mb-8' /> */}
            <div className='md:flex md:justify-between py-[2.5rem] border border-gray-100 lg:px-[7.5rem] px-4'>
                <div className='mb-6 md:mb-0'>
                    <div className='flex flex-wrap items-center gap-x-4 gap-y-0'>
                        <img
                            width='auto'
                            height='auto'
                            src={klh}
                            loading='lazy'
                            alt='KLH Logo'
                            className='w-[21em] mb-5'
                        />
                        <img
                            width='auto'
                            height='auto'
                            src={amdalnet}
                            loading='lazy'
                            alt='KLH Logo'
                            className='w-[12rem] mb-5'
                        />
                    </div>
                    <h3
                        className="text-[1.1rem] mb-1 font-semibold text-gray-700"
                    >
                       Seleksi Tenaga Teknis Operasional Amdalnet
                    </h3>
                    <h3
                        className="text-[14px] font-medium text-gray-500"
                    >
                        ©{new Date().getFullYear()}. All Rights Reserved.
                    </h3>
                </div>
                <div className='grid'>
                    <div>
                        <h3 className='mb-6 text-[1.20rem] text-gray-700 font-semibold'>
                            Tentang Kami
                        </h3>
                        <ul>
                            <li className='mb-4 text-lg'>
                                <a
                                    href='https://amdalnet.menlhk.go.id/#/'
                                    className="hover:underline"
                                >
                                    Website Resmi Amdalnet
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    )
}