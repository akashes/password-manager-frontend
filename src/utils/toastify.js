import {toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';


export const showSuccessAlert=(message)=>{
    toast.success(message,{
        position:"top-right",
        autoClose:5000
    })
}

export const showFailedAlert=(message)=>{
    toast.error(message,{
        position:'top-center',
        autoClose:5000
    })
}

//import these functions in the required components and also import <ToastContainer/> in the app/index.js