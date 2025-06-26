import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { useNavigate, NavLink } from 'react-router-dom'
import React, { useCallback, useEffect, useState } from 'react'

import klh from '../../assets/images/klh.png'
import amdalnet from '../../assets/images/amdalnet.png'
// import DarkBtn from '@/components/button/DarkBtn'

export default function Topbar() {

    // const location = useLocation()
    const navigate = useNavigate();

    const [isScrolled, setIsScrolled] = useState(false);

    // const checkPathPersonal = useCallback(() => {
    //     if (
    //         location.pathname === '/overview' ||
    //         location.pathname === '/portfolio' ||
    //         location.pathname === '/people'
    //     )
    //         return 'text-white'
    //     return 'text-gray-300'
    // }, [location])

    const changeColor = useCallback(() => {
        setIsScrolled(window.scrollY > 0);
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', changeColor);
        return () => {
          window.removeEventListener('scroll', changeColor);
        };
    }, [changeColor]);

    return (
        <header
            className={`${isScrolled ? 'bg-white border-b border-gray-100' : 'bg-transparent border-0 border-gray-100'} transition-colors  sticky top-0 z-[999] w-full md:px-[7.5rem] px-4`}
        >
            {/* Dekstop Menu Navbar */}
            <Menu>
                <div className='montserrat flex max-5xs:flex-col gap-2 py-6 max-5xs:py-4 max-xs:gap-1 items-center justify-between max-6xs:justify-center'>
                    <div className='brand-image flex items-center gap-4'>
                        <img
                            src={klh}
                            width='auto'
                            height='auto'
                            loading='lazy'
                            alt={`Me Logo`}
                            className='w-[3rem]'
                        />
                        <img
                            src={amdalnet}
                            width='auto'
                            height='auto'
                            loading='lazy'
                            alt={`Me Logo`}
                            className='w-[11rem]'
                        />
                    </div>
                    <div className='hidden items-center lg:block'>
                        <div
                            className="flex items-center"
                        >
                            <ItemDropdownNav
                                title={'Beranda'}
                                path={'/'}
                            />
                        </div>
                    </div>
                    <div className='lg:block hidden'>
                        <div className='flex items-center gap-4'>
                            <button onClick={() => {
                                navigate('/login')
                            }} className='bg-green-base rounded-[10px] border-0 py-3 px-8 text-white hover:bg-green-base/80 cursor-pointer'>
                                Masuk
                            </button>
                            {/* <button className='border border-green-base rounded-[10px] py-3 px-8 text-green-base bg-green-base/10 hover:bg-green-base/20 cursor-pointer'>
                                Daftar
                            </button> */}
                        </div>
                    </div>
                    <div
                        className="-mr-2 flex lg:hidden lg:gap-0 gap-2 rounded-full py-[0.75rem] px-4"
                    >
                        {/* <DarkBtn /> */}
                        <Menu.Button className='inline-flex items-center justify-center rounded-md text-gray-600 focus:outline-none'>
                            <span className='sr-only'>Open main menu</span>
                            <svg
                                className='block h-6 w-full ui-open:hidden'
                                xmlns='http://www.w3.org/2000/svg'
                                fill='none'
                                viewBox='0 0 24 24'
                                stroke='currentColor'
                                aria-hidden='true'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='2'
                                    d='M4 6h16M4 12h16M4 18h16'
                                />
                            </svg>
                            <svg
                                className='hidden h-6 w-6 ui-open:block'
                                xmlns='http://www.w3.org/2000/svg'
                                fill='none'
                                viewBox='0 0 24 24'
                                stroke='currentColor'
                                aria-hidden='true'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='2'
                                    d='M6 18L18 6M6 6l12 12'
                                />
                            </svg>
                        </Menu.Button>
                    </div>
                </div>

                {/* Mobile Menu Navbar */}
                <Transition
                    enter='transition ease-out duration-100 transform'
                    enterFrom='opacity-0 scale-95'
                    enterTo='opacity-100 scale-100'
                    leave='transition ease-in duration-75 transform'
                    leaveFrom='opacity-100 scale-100'
                    leaveTo='opacity-0 scale-95'
                    className='absolute w-full left-0 shadow-sm outline-0'
                >
                    <Menu.Items
                        className='montserrat lg:hidden rounded-[1.15rem] bg-white overflow-y-auto h-auto'
                        id='mobile-menu'
                    >
                        <div className='space-y-1 p-5'>
                            <Menu.Item>
                                <ItemNav
                                    title={'Beranda'}
                                    path={'/'}
                                    classItemNav='block py-4 bg-gray-100'
                                />
                            </Menu.Item>
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>
        </header>
    )
}

/* Child Component Navbar  */
const WrapperItemsDropdownNav = React.memo(
    ({
        head_title,
        checkPath,
        children,
        classDropDownButton,
        classChildDropDownButton,
        classDropDownTransition,
        classDropDownWrapItem,
    }) => {

        const [rotate, setRotate] = useState(false)
        const handleRotateChange = () => {
            setRotate(!rotate)
        }

        return (
            <Menu as={'div'} className='relative'>
                <Menu.Button
                    onClick={handleRotateChange}
                    className={`${classDropDownButton} ${checkPath} text-[1rem] font-medium`}
                >
                    <div
                        className={`${classChildDropDownButton} flex items-center gap-2`}
                    >
                        <span>{head_title}</span>
                        <ChevronDownIcon className={`h-4 w-4 transition-transform`} />
                    </div>
                </Menu.Button>
                <Transition
                    enter='transition-transform duration-100 ease-out'
                    enterFrom='transform scale-95 opacity-0'
                    enterTo='transform scale-100 opacity-100'
                    leave='transition duration-100 ease-out'
                    leaveFrom='transform scale-100 opacity-100'
                    leaveTo='transform scale-95 opacity-0'
                    className={`${classDropDownTransition}`}
                >
                    <Menu.Items
                        className={`${classDropDownWrapItem} shadow-own flex flex-col rounded-[5px] bg-white py-1`}
                    >
                        {children}
                    </Menu.Items>
                </Transition>
            </Menu>
        )
    }
)
const ItemDropdownNav = React.memo(({ title, path }) => {
    return (
        <Menu.Item>
            {() => (
                <NavLink
                    className={({ isActive }) =>
                        isActive ? "text-green-base font-semibold text-[1.1rem]" : "bg-white text-black"
                    }
                    to={path}
                >
                    {title}
                </NavLink>
            )}
        </Menu.Item>
    )
})
const ItemNav = React.memo(({ title, path }) => {
    return (
        <NavLink
            to={path}
            className={({ isActive }) =>
                isActive ? "text-green-base font-semibold text-[1.1rem]" : "bg-white text-black"
            }
        >
            {title}
        </NavLink>
    )
})
