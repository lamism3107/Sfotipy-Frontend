import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { storage } from "../config/firebase/firebase.config";
import { toast } from "react-toastify";
export const formatDate = (createdAt) => {
  const date = new Date(createdAt);
  // const hours = date.getHours().toString().padStart(2, "0");
  // const minutes = date.getMinutes().toString().padStart(2, "0");
  // const seconds = date.getSeconds().toString().padStart(2, "0");
  // const formattedDate = `${hours}:${minutes}:${seconds} ${date
  //   .getDate()
  //   .toString()
  //   .padStart(2, "0")}/${(date.getMonth() + 1)
  //   .toString()
  //   .padStart(2, "0")}/${date.getFullYear()}`;

  // Định dạng ngày tháng theo kiểu dd/mm/yyyy
  const formattedDate = date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  return formattedDate;
};

export const uploadFile = (e, fileCategory, setSource) => {
  const file = e.target.files[0];
  console.log("ditme");
  if (file) {
    console.log("check file", file);
    // const reader = new FileReader();
    // reader.onloadend = () => {
    //   setImgUploaded(reader.result);
    // };
    // reader.readAsDataURL(file);
  }
  //Firebase docs upload file to web: https://firebase.google.com/docs/storage/web/upload-files?hl=en&authuser=
  let firebasePath = "";
  if (fileCategory === "songImg") firebasePath = "image/songImg";
  else if (fileCategory === "audio") firebasePath = "audio";
  else if (fileCategory === "userImg") firebasePath = "image/userImg";
  else if (fileCategory === "albumImg") firebasePath = "image/albumImg";
  else if (fileCategory === "playlistImg") firebasePath = "image/albumImg";
  // Sau prefix firebasePath là filename. Để tránh conflict khi đặt trùng tên file, thêm prefix là ngày tạo (Date.now)-filename)
  const storageRef = ref(storage, `${firebasePath}/${Date.now()}-${file.name}`);

  const uploadTask = uploadBytesResumable(storageRef, file);
  uploadTask.on(
    "state_changed",
    (snapshot) => {
      // Observe state change events such as progress, pause, and resume
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      // const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      // setUploadProgress(progress);
      // switch (snapshot.state) {
      //   case "paused":
      //     console.log("Upload is paused");
      //     break;
      //   case "running":
      //     console.log("Upload is running");
      //     break;
      // }
    },
    (error) => {
      // Handle unsuccessful uploads
      toast.error("Upload failed", error);
    },
    () => {
      // Handle successful uploads on complete
      // For instance, get the download URL: https://firebasestorage.googleapis.com/...
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        console.log("url", downloadURL);

        setSource(downloadURL);
        toast.success("Upload successful");
      });
    }
  );
};

export const deleteFirebaseItem = (referenceUrl) => {
  const deleteRef = ref(storage, referenceUrl);
  deleteObject(deleteRef)
    .then(() => {
      return true;
    })
    .catch((error) => {
      return false;
    });
};

export const debounce = (func, delay) => {
  let timeout;
  console.log(" time previous");

  return () => {
    console.log(" time previous");
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }

    timeout = setTimeout(() => {
      func();
    }, delay);
  };
};

export function tinhToanKhoangCasGiua2Ngay(date1, date2) {
  // Tính toán difference in milliseconds
  const diffInMs = Math.abs(date2 - date1);

  // Đổi miliseconds sang ngày (đã loại bỏ phần miliseconds)
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

  // Ví dụ: Tính toán khoảng cách giữa 01/01/2024 và ngày hôm nay
  // const ngayCanhNam = new Date(2024, 0, 1); // Tháng bắt đầu từ 0
  // const today = new Date();
  // const soNgayDaQua = tinhToanKhoangCasGiua2Ngay(ngayCanhNam, today);
  // console.log(soNgayDaQua);
  return diffInDays;
}
