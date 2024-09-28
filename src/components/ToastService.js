import { toast } from 'react-toastify';

export const showToast = (message, type) =>{
    toast(message, {
        type: type,
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    })
}