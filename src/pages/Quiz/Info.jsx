import {
  UserIcon,
  EnvelopeIcon,
  IdentificationIcon,
  PlayCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

const Info = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const assessment = {
    name: "Asesmen Kompetensi Programmer",
    session: "Sesi 1",
    time: "27 Juni 2025, 09:00 - 11:00 WIB",
    user: {
      name: "Budi Santoso",
      email: "budi@example.com",
      role: "Peserta",
    },
  };

  const handleConfirm = () => {
    setIsOpen(false);
    navigate("/quiz/ready");
  };

  return (
    <div className="flex items-center justify-center px-4">
      <div className="bg-white backdrop-blur-lg rounded-xl shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-bold text-blue-900 mb-4">Informasi Asesmen</h2>

        <div className="text-sm text-gray-800 space-y-2">
          <div>
            <span className="font-semibold">Nama Asesmen:</span> {assessment.name}
          </div>
          <div>
            <span className="font-semibold">Waktu:</span> {assessment.time}
          </div>
          <div>
            <span className="font-semibold">Sesi:</span> {assessment.session}
          </div>

          <hr className="my-3" />

          <div className="font-semibold">Data Peserta:</div>
          <div className="flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-gray-600" />
            {assessment.user.name}
          </div>
          <div className="flex items-center gap-2">
            <EnvelopeIcon className="w-4 h-4 text-gray-600" />
            {assessment.user.email}
          </div>
          <div className="flex items-center gap-2">
            <IdentificationIcon className="w-4 h-4 text-gray-600" />
            {assessment.user.role}
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="mt-6 flex justify-between items-center">
          <button
            onClick={() => navigate("/quiz/simulation")}
            className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-all"
          >
            🧪 Simulasi
          </button>

          <button
            onClick={() => setIsOpen(true)}
            className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all"
          >
            <PlayCircleIcon className="w-5 h-5" />
            Mulai Asesmen
          </button>
        </div>
      </div>

      {/* MODAL KONFIRMASI */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center px-4">
            <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all space-y-4">
              <div className="flex items-center gap-3">
                <ExclamationTriangleIcon className="w-6 h-6 text-yellow-500" />
                <Dialog.Title className="text-lg font-medium text-gray-800">
                  Konfirmasi
                </Dialog.Title>
              </div>
              <Dialog.Description className="text-sm text-gray-600">
                Apakah kamu yakin ingin memulai asesmen sekarang? Pastikan kamu sudah siap.
              </Dialog.Description>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-md text-sm bg-gray-100 hover:bg-gray-200 text-gray-700"
                >
                  Batal
                </button>
                <button
                  onClick={handleConfirm}
                  className="px-4 py-2 rounded-md text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium"
                >
                  Ya, Mulai
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default Info;
