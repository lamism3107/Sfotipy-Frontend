import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { storage } from "../config/firebase/firebase.config";
import { toast } from "react-toastify";
import { RiContactsBookLine } from "react-icons/ri";
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
  //Firebase docs upload file to web: https://firebase.google.com/docs/storage/web/upload-files?hl=en&authuser=
  let firebasePath = "";
  if (fileCategory === "songImg") firebasePath = "image/songImg";
  else if (fileCategory === "userImg") firebasePath = "image/userImg";
  else if (fileCategory === "albumImg") firebasePath = "image/albumImg";
  else if (fileCategory === "playlistImg") firebasePath = "image/playlistImg";
  // Sau prefix firebasePath là filename. Để tránh conflict khi đặt trùng tên file, thêm prefix là ngày tạo (Date.now)-filename)
  const storageRef = ref(storage, `${firebasePath}/${Date.now()}-${file.name}`);

  let resultURL = null;
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
        toast.success("Upload successful");
        setSource(downloadURL);
      });
    }
  );
  return resultURL;
};

export const deleteFirebaseItem = (referenceUrl) => {
  const deleteRef = ref(storage, referenceUrl);
  deleteObject(deleteRef)
    .then(() => {
      console.log("delete successfully");
      return;
    })
    .catch((error) => {
      return;
    });
};

export function calculateTimeDifference(date) {
  const now = new Date();
  const inputDate = new Date(date);
  const diff = now - inputDate;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return `Vừa xong`;
  } else if (minutes < 60) {
    return `${minutes} phút trước`;
  } else if (hours < 24) {
    return `${hours} giờ trước`;
  } else {
    return `${days} ngày trước`;
  }
}

export function audio(audioURL) {
  return (
    <audio src={audioURL} controls autoplay muted>
      {/* <source src="horse.ogg" type="audio/ogg">
  <source src="horse.mp3" type="audio/mpeg">
Your browser does not support the audio element. */}
    </audio>
  );
}
