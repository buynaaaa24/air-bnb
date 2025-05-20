'use client';

import { ClipLoader } from "react-spinners";

const Loader = () => {
  return (
    <div className="h-[70vh] flex flex-col justify-center items-center gap-4">
      <ClipLoader size={50} color="#2563EB" />
      <span className="text-gray-500 text-sm">Уншиж байна...</span>
    </div>
  );
};

export default Loader;
