import { Helmet, HelmetProvider } from 'react-helmet-async'

import SideBar from '../components/Navbar/Sidebar'
import TopbarDashboard from '../components/Navbar/TopbarDashboard'

const DashboardLayout = ({
    title = 'Seleksi Tenaga Teknis Operasional Amdalnet 2025',
    children = '',
}) => {
    return (
        <HelmetProvider>
            <Helmet prioritizeSeoTags>
                <title>{title}</title>

                <link rel='preconnect' href='https://fonts.googleapis.com' />
                <link
                    rel='preconnect'
                    href='https://fonts.gstatic.com'
                    crossorigin
                />
                <link
                    href='https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap'
                    rel='stylesheet'
                />
                <link
                    href='https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap'
                    rel='stylesheet'
                />
                <link
                    href='https://api.fontshare.com/css?f[]=general-sans@200,201,300,301,400,401,500,501,600,601,700,701,1,2&display=swap'
                    rel='stylesheet'
                ></link>
            </Helmet>

            <main className='flex items-start'>
                <SideBar />
                <section className='xl:w-[80%] md:w-[70%] w-full'>
                    <TopbarDashboard />
                    {children}
                </section>
            </main>
        </HelmetProvider>
    )
}

export default DashboardLayout
