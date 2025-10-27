import React, { useContext, useState } from "react";
import './LoginPopUp.css';
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/storeContext";
import axios from "axios"

const LoginPopUp=({setShowLogin})=>{
    const {url,setToken}=useContext(StoreContext);
    const [currState,setCurrState]=useState("signup");
    const [data,setData]=useState({
        name:"",
        email:"",
        password:"",
        role:"user"
    })

   const onChangeHandler=(event)=>{
    const name=event.target.name;
    const value=event.target.value;
    setData(data=>({...data,[name]:value}))
   }

   const onLogin=async (event)=>{
event.preventDefault();
let newUrl=url;
if(currState==='login'){
    newUrl+="/api/user/login"
}
else{
    newUrl+="/api/user/register"
}

console.log("Requesting:", newUrl);
console.log("Data being sent:", data);

const response=await axios.post(newUrl,data);
if(response.data.success){
setToken(response.data.token);
localStorage.setItem("token",response.data.token);
localStorage.setItem("role",response.data.user.role);
console.log("Token saved to localStorage");

setShowLogin(false);
      if (response.data.user.role === "admin") {
        window.location.href = "http://localhost:5174"; // Admin app
      } else {
        window.location.href = "http://localhost:5173"; // User app
      }

}else{
    alert(response.data.message);
}
   }

   


    return(
        <div className="login-popup">
<form className="login-popup-container" onSubmit={onLogin}>
    <div className="login-popup-title">
<h2>{currState}</h2>
<img onClick={()=>setShowLogin(false)} src={assets.cross_icon} alt=""/>
    </div>
    <div className="login-popup-input">
        {currState==="login"?<></>: <>
        <input name="name" onChange={onChangeHandler} value={data.name} type="text" placeholder="Your name" required/>,
         <label>Role: </label>
        <select name="role" value={data.role} onChange={onChangeHandler}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select><br/>
        </>
        }
       
        <input name="email" onChange={onChangeHandler} value={data.email} type="email" placeholder="Your email" required/>
        <input name="password" onChange={onChangeHandler} value={data.password} type="password" placeholder="Password" required/>
        
        <button type="submit">{currState==='signup'?"Create account":"Login"}</button>
    </div>
    <div className="login-popup-condition">
        <input type="checkbox" required/>
        <p>By continuing, I agree to the terms of use & privacy policy</p>

    </div>
    {currState==="signup"? <p>Already have an account? <span onClick={()=>setCurrState("login")}>Login here</span></p>:
    <p>Create a new account? <span onClick={()=>setCurrState("signup")}>Click here</span></p>
       }
   
</form>
        </div>
    )
}

export default LoginPopUp;