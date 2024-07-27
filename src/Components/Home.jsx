import React, { useEffect, useState } from "react";
import Header from "./Header";
import axios from "axios";
import openeye from "../images/visible.png";
import closedeye from "../images/eye.png";
import { serverUrl  } from "../utils/serverUrl";
import { showFailedAlert, showSuccessAlert } from "../utils/toastify";
const Home = () => {
 
  const [allPasswordData, setAllPasswordData] = useState(null);
  const [passwordData, setPasswordData] = useState({
    website: "",
    password: "",
    username: "",
    id:""
  });
  const [passwordArray, setPasswordArray] = useState([])
  const [loadUpdatedData, setLoadUpdatedData] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const[editState,setEditState]=useState(false)

  const setData = (e) => {
    console.log(e.target.name);
    console.log(e.target.value);

    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const savePasswordData = async (e) => {
    const{website,password,username}=passwordData
    if(website.length<3 || username.length<3 || password.length<3){
      showFailedAlert('Password not saved!')
    }else{
      if(editState){
        console.log('inside edit')
        axios.put(`${serverUrl}/edit-password`,passwordData).then((result)=>{
          console.log(result)
          console.log('edit successfull')
        }).catch((err)=>{
          console.log(err)
        })
        setLoadUpdatedData(prev=>!prev)
        setEditState(prev=>!prev)
  
  
      }else{
        e.preventDefault();
        let result = await axios.post(
          `${serverUrl}/add-password`,
          passwordData
        );
    
        setPasswordData({
          website: "",
          password: "",
          username: "",
        });
        setLoadUpdatedData((prev) => !prev);
  
      }
     



    }
    

   

   
  };

  const handleDeleteAllPassword = async () => {
    localStorage.removeItem('passwords')
    setPasswordArray([])
    
    await axios.delete(`${serverUrl}/delete-all-password`);
    setLoadUpdatedData((prev) => !prev);
  };

  const handleDeleteOneData=async(id)=>{
    console.log(id)
    
    axios.delete(`${serverUrl}/delete-one-password/${id}`).then((result)=>{
      console.log(result.data)
      setLoadUpdatedData(prev=>!prev)
    }).catch((err)=>{
      console.log(err)
    })
  }
  const handleEditPassword=async(data)=>{
    let {website,password,username,_id}=data
    setPasswordData({website,password,username,id:_id})
    setEditState(true)
   

  }
  useEffect(() => {
    const getAllPasswordData = async () => {
      const result = await axios.get(`${serverUrl}/get-all-password`);
      console.log(result);
      setAllPasswordData(result.data);
    };

    getAllPasswordData();
  }, [loadUpdatedData]);



  return (
    <main className="container">
    <header>
    <h1 className="font-bold text-4xl text-center mt-8">
        <span className="title-decoration">&lt;</span>Pass
        <span className="title-decoration">OP/&gt;</span>
      </h1>
      <p className="text-center text-gray-700 text-sm">
        YOUR OWN PASSWORD MANAGER
      </p>
    </header>

      <form className=" flex flex-col  gap-4 input-container px-8 max-w-4xl  m-auto">
        <input
          name="website"
          onChange={(e) => setData(e)}
          className="border w-full  "
          type="text"
          placeholder="Enter website url"
          value={passwordData?.website || ""}
        />
        <div className="   flex w-full  gap-4  ">
          <input
            name="username"
            onChange={(e) => setData(e)}
            className="border w-1/2"
            type="text"
            placeholder="Enter username"
            value={passwordData?.username || ""}
          />
          <div className="relative w-1/2 ">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              onChange={(e) => setData(e)}
              className="border "
              placeholder="Enter password"
              value={passwordData?.password || ""}
            />
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute md:right-14 top-[13px]"
            >
              <img
                className="cursor-pointer"
                height={20}
                width={20}
                src={showPassword ? openeye : closedeye}
                alt=""
              />
            </span>
          </div>
        </div>
        <div className="button-container text-center">
          <button
            className="button flex justify-center items-center mx-auto border-green-500 border-2 px-2 py-1 rounded-2xl gap-2 bg-green-500 text-white shadow-lg"
             onClick={savePasswordData} 
          >
            <i className="fa-regular fa-floppy-disk"></i>
            Save
          </button>
        </div>
      </form>

{
  allPasswordData?.length==0 && <p>No passwords saved</p>
}{
  allPasswordData?.length>0 &&  <div className="table-container max-w-4xl m-auto">
  <h3 className="text-sm text-slate-600 tracking-wider ">YOUR PASSWORDS</h3>
  <table className="table-auto w-full border-8 border-collapse    ">
    <thead className="text-center ">
      <tr className="border bg-green-950 text-white text-sm ">
        <th>Site</th>
        <th>Username</th>
        <th>Password</th>
        <th>Created at</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody className="bg-green-100">
      {allPasswordData?.length > 0 ? (
        allPasswordData.map((data) => {
          let time = new Date(data?.createdAt);
          const year = time.getFullYear();
          const month = (time.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-indexed, so add 1
          const day = time.getDate().toString().padStart(2, "0");

          // Extract time components
          const hours = time.getHours().toString().padStart(2, "0");
          const minutes = time.getMinutes().toString().padStart(2, "0");

          // Format the date and time as needed
          const formattedDate = `${year}-${month}-${day}`;
          const formattedTime = `${hours}:${minutes}`;
          // console.log(time);
          // console.log(time);
          return (
            <tr className="border border-2 border-black">
              <td className="flex justify-between p-1 items-center ">
                <a style={{textDecoration:'none',color:'black'}} href={data.website} target='_blank'>
                  
                {data?.website}
                </a>
                <i  onClick={()=>{
                  navigator.clipboard.writeText(data?.website).then(()=>{
                    showSuccessAlert('Website url copied to clipboard')
                  }).catch((err)=>{
                    console.log('Failed to copy text',err)
                  })
                }} class="fa-solid fa-copy">
              
                </i>
                </td>
              <td className="text-center">{data?.username}</td>
              <td className="flex justify-between items-center">
                {"*".repeat(data?.password.length)}
                <i  onClick={()=>{
                  navigator.clipboard.writeText(data?.password).then(()=>{
                    showSuccessAlert('Website url copied to clipboard')
                  }).catch((err)=>{
                    console.log('Failed to copy text',err)
                  })
                }} class="fa-solid fa-copy">
                
                </i>
                </td>
              <td className="text-center">

                <span className="font-semibold mr-2 text-gray-600">
                  {formattedDate}
                </span>{" "}
                <span className="text-green-900 font-bold">
                  {formattedTime}
                </span>
              </td>
              <td className="flex justify-around items-center">
              <i onClick={()=>handleEditPassword(data)} className="fa-solid fa-edit"></i>
           
      
                <i onClick={()=>handleDeleteOneData(data._id)} className="fa-solid fa-trash"></i>
              </td>
            </tr>
          );
        })
      ) : (
        <p className="text-center text-red-800">NO PASSWORD DATA</p>
      )}
    </tbody>
  </table>
</div>
}
     
      <div className="text-center my-12">
        <button
          className="border-3 px-4 py-3  bg-green-700 text-white rounded-3xl "
          onClick={handleDeleteAllPassword}
        >
          Delete All Data
        </button>
      </div> 
    </main>
  );
};

export default Home;
