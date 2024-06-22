"use client";
import { ToastContainer } from "react-toastify";

const MainLayout = ({ children }) => {
  return (
    <div className="flex gap-2">
      {children}
      <ToastContainer draggablePercent={60} autoClose={5000} limit={3} />
    </div>
  );
};

export default MainLayout;
