import { ToastContainer } from "react-toastify";
import Sidebar from "../../components/Sidebar/Sidebar";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import SongBar from "../../components/SongBar/SongBar";

const MainLayout = ({ children }) => {
  return (
    <div>
      <div className="flex gap-2 relative z-20 ">
        <Sidebar />

        {/* w-[calc(75%-8px)] */}
        <div className=" flex-1 mt-2 max-h-[calc(100vh-95px)]  rounded-lg ">
          {children}
        </div>
      </div>

      {/* <ConfirmModal /> */}
      <SongBar />
    </div>
  );
};

export default MainLayout;
