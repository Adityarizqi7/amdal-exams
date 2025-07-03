// import { useState } from "react"

import CommonLayout from "../layouts/CommonLayout"

import '../styles/library/Marquee.css'
import klh from '../../src/assets/images/klh-half-gray.png'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "flowbite-react"

const Home = () => {

  // const [openModal, setOpenModal] = useState(true);

  return (
    <CommonLayout
      title='Beranda - Seleksi Tenaga Teknis Operasional Amdalnet 2025'
    >
      <div className="home-component mb-[5rem] max-2xs:mb-[4rem] max-3xs:mb-[2rem]">
        {/* <Modal show={openModal} onClose={() => setOpenModal(false)}>
          <ModalHeader>Pengumuman, Harap Diperhatikan!</ModalHeader>
          <ModalBody>
            <div className="space-y-6">
              <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              Mohon bersabar ya, ujiannya belum dimulai.<br /><br />
              Akun Anda (email dan kata sandi) belum dapat digunakan hingga waktu pelaksanaan ujian dimulai. Silakan mencoba kembali saat ujian telah dibuka sesuai jadwal formasi.
              </p>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => setOpenModal(false)}>Mengerti</Button>
          </ModalFooter>
        </Modal> */}
        <div className="jumbotron absolute top-[0] z-0">
            <img
                width='auto'
                height='auto'
                src={klh}
                loading='lazy'
                alt='KLH Logo'
                className='sm:w-[40rem] max-xxxs:w-[36rem] max-xxs:w-[28rem] h-[40rem] object-cover opacity-15'
            />
        </div>
        <div className="greeting-text montserrat w-[70rem] max-xxxs:w-full mx-auto max-xxxs:mt-[2rem] max-5xs:mt-[1rem] mt-[6rem] text-center max-xxxs:px-3 max-3xs:px-1">
          <h1 className="text-center text-gray-700 text-[2.9rem] max-xxxs:text-[5vw] max-3xs:text-[7vw] font-bold relative z-10">Kini Saatnya Menjadi Bagian dari <span className="text-green-base">AMDALNET</span> dan Berkontribusi untuk Indonesia!</h1>
          <h4 className="mt-4 text-neutral-500 font-medium text-[1.1rem] max-xxxs:text-[2vw] max-xs:text-[2.5vw] max-3xs:text-[12px] text-center leading-loose">PDLUK membuka lowongan untuk Putra Putri Terbaik Indonesia melalui Seleksi Tenaga Teknis Operasional Amdalnet 2025.</h4>
          <button onClick={() => {
            window.open('https://www.s.id/hasil_ujikompetensi', '_blank')
          }} className="bg-green-300/60 text-green-600 hover:bg-green-300 font-semibold rounded-[10px] border-0 py-3 max-2xs:py-2 px-8 max-2xs:px-5 cursor-pointer mx-auto max-xxxs:mt-8 mt-14 text-[1.1rem] max-xxxs:text-[2vw] max-2xs:text-[12px]">Lihat Pengumuman</button>
        </div>
        <div className="running-text marquee-container py-6 max-xxs:py-4 font-semibold bg-green-base mt-[6.5rem] max-xxs:mt-[4rem] max-3xs:mt-[2rem] relative z-10">
            <h1 className="text-white max-xxs:text-[3vw] max-3xs:text-[4vw] text-[1.2rem] montserrat marquee-content"><strong>[INFORMASI]</strong> Pengumuman <strong>Hasil Uji Kemampuan Teknis PENGADAAN TENAGA PENDUKUNG TEKNIS DOKUMEN LINGKUNGAN HIDUP AMDALNET</strong> telah disampaikan melalui laman <strong>amdalnet.menlhk.go.id</strong> pada portal "Berita Terkini".</h1>
        </div>
      </div>
    </CommonLayout>
  )
}

export default Home