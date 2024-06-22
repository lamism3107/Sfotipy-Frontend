import { useEffect, useRef, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";

export default function ConfirmModal(props) {
  const {
    children,
    title,
    isOpen,
    onOk,
    onCancel,
    cancelButton,
    okButton,
    className,
  } = props;
  const modalRef = useRef(null);
  const modalBoxRef = useRef(null);

  const handleClickOutside = (event) => {
    if (modalBoxRef.current && !modalBoxRef.current.contains(event.target)) {
      onCancel();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className=" bg-darkOverlay overflow-y-hidden overflow-x-hidden fixed top-0 right-0 left-0 bottom-0 z-50 justify-center items-center w-full md:inset-0  max-h-full"
      ref={modalRef}
    >
      <div
        className={` absolute left-[50%] translate-x-[-50%] top-[50%]  overflow-y-hidden translate-y-[-50%]  max-h-full ${
          className !== "" ? `${className} ` : "w-full h-full"
        } `}
      >
        <div
          ref={modalBoxRef}
          className="relative bg-white  shadow py-9 px-7 rounded-lg"
        >
          <div className="flex items-center justify-between   rounded-t ">
            <h3 className="text-2xl font-semibold text-black  text-center">
              {title}
            </h3>
          </div>

          {/* Body  */}
          <div
            className={`pb-8 pt-2   max-h-[calc(100vh-100px)] overflow-y-auto text-black`}
          >
            {children}
          </div>

          {/* Footer  */}
          <div>
            <div className="flex items-center justify-end  rounded-b ">
              <button
                onClick={onCancel}
                type="button"
                className="py-2.5 px-5 text-md hover font-semibold hover:scale-105 text-black transition-all ease-out duration-100 focus:outline-none bg-white rounded-lg  "
              >
                {cancelButton || "cancel"}
              </button>
              <button
                onClick={onOk}
                data-modal-hide="default-modal"
                type="button"
                className=" rounded-full font-semibold hover:scale-105 bg-green-400 ms-3  text-md text-black px-5 py-2.5 text-center "
              >
                {okButton || "OK"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
