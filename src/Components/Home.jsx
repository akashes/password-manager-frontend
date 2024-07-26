import React, { useEffect, useState } from "react";
import Header from "./Header";
import axios from "axios";
import openeye from "../images/visible.png";
import closedeye from "../images/eye.png";
import { serverUrl  } from "../utils/serverUrl";
import { showSuccessAlert } from "../utils/toastify";
const Home = () => {
  const [allPasswordData, setAllPasswordData] = useState(null);
  const [passwordData, setPasswordData] = useState({
    website: "",
    password: "",
    username: "",
  });
  const [passwordArray, setPasswordArray] = useState([])
  const [loadUpdatedData, setLoadUpdatedData] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const setData = (e) => {
    console.log(e.target.name);
    console.log(e.target.value);

    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const savePasswordData = async (e) => {
    console.log(passwordData);
    

    // setPasswordArray(prevArray => {
    //   const updatedArray = [...prevArray, passwordData];
    //   localStorage.setItem('passwords', JSON.stringify(updatedArray));
    //   return updatedArray;
    // });
   
    e.preventDefault();
    let result = await axios.post(
      "http://localhost:4000/add-password",
      passwordData
    );

    setPasswordData({
      website: "",
      password: "",
      username: "",
    });
    setLoadUpdatedData((prev) => !prev);
  };

  const handleDeleteAllPassword = async () => {
    localStorage.removeItem('passwords')
    setPasswordArray([])
    
    await axios.delete(`http://localhost:4000/delete-all-password`);
    setLoadUpdatedData((prev) => !prev);
  };

  useEffect(() => {
    const getAllPasswordData = async () => {
      const result = await axios.get("http://localhost:4000/get-all-password");
      console.log(result);
      setAllPasswordData(result.data);
    };

    getAllPasswordData();
  }, [loadUpdatedData]);

  useEffect(()=>{
    let passwords=localStorage.getItem('passwords')
    if(passwords){
      setPasswordArray(JSON.parse(passwords))
    }else{

    }

  },[])

  return (
    <main>
    <header>
    <h1 className="font-bold text-4xl text-center mt-8">
        <span className="title-decoration">&lt;</span>Pass
        <span className="title-decoration">OP/&gt;</span>
      </h1>
      <p className="text-center text-gray-700 text-sm">
        YOUR OWN PASSWORD MANAGER
      </p>
    </header>

      <div className="input-container px-8 max-w-4xl  m-auto">
        <input
          name="website"
          onChange={(e) => setData(e)}
          className="border w-full  "
          type="text"
          placeholder="Enter website url"
          value={passwordData?.website || ""}
        />
        <div className="flex w-full ">
          <input
            name="username"
            onChange={(e) => setData(e)}
            className="border flex-1"
            type="text"
            placeholder="Enter username"
            value={passwordData?.username || ""}
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              onChange={(e) => setData(e)}
              className="border flex-4"
              placeholder="Enter password"
              value={passwordData?.password || ""}
            />
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-[22px]"
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
            className="button flex justify-center items-center mx-auto border-green-500 border-2 px-2 py-1 rounded-2xl"
             onClick={savePasswordData} 
          >
            <lord-icon
              src="https://cdn.lordicon.com/zrkkrrpl.json"
              trigger="hover"
              style={{ width: "40px", height: "40px" }}
            ></lord-icon>
            Save
          </button>
        </div>
      </div>

{
  allPasswordData?.length==0 && <p>No passwords saved</p>
}{
  allPasswordData?.length>0 &&  <div className="table-container max-w-4xl m-auto">
  <h3>YOUR PASSWORDS</h3>
  <table className="table-auto w-full border-8 border-collapse    ">
    <thead>
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
            <tr>
              <td className="flex justify-between p-1 items-center">
                <a href={data.website} target='_blank'>
                  
                {data?.website}
                </a>
                <div className="tooltip">
                <i  onClick={()=>{
                  navigator.clipboard.writeText(data?.website).then(()=>{
                    showSuccessAlert('Website url copied to clipboard')
                  }).catch((err)=>{
                    console.log('Failed to copy text',err)
                  })
                }} class="fa-solid fa-copy">
                <span className="tooltip-text">
                copy link</span>
                </i>
                </div>
                </td>
              <td className="text-center">{data?.username}</td>
              <td className="text-center">{data?.password}</td>
              <td className="text-center">
                <span className="font-semibold mr-2 text-gray-600">
                  {formattedDate}
                </span>{" "}
                <span className="text-green-900 font-bold">
                  {formattedTime}
                </span>
              </td>
              <td className="text-center">
                <span class="actions">Edit</span> |{" "}
                <span class="actions">Delete</span>
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
          className="border-3 p-4 bg-green-700 text-white rounded-lg "
          onClick={handleDeleteAllPassword}
        >
          Delete
        </button>
      </div>
    </main>
  );
};

export default Home;
