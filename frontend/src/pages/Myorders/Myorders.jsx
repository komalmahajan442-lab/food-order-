import React, {useEffect, useContext,useState } from "react";
import "./Myorder.css";
import { StoreContext } from "../../context/storeContext";
import axios from "axios";

import { assets } from "../../assets/assets";
export const Myorders=()=>{
    const {url,token}=useContext(StoreContext);
    const [data,setData]=useState([]);
    const fetchOrders=async ()=>{
        try{
        const response=await axios.post(`${url}/api/order/userorders`,{},{headers:{token}});
        setData(response.data.data);
        console.log(response.data.data);
    }catch(error){
        console.log(error);
    }}

    useEffect(()=>{
if(token){
    fetchOrders();
}
    },[token])
    return(
        <div className="my-orders">
            <div className="container">
                {data.map((order,index)=>{
                    return(
                        <div key={index} className="my-orders-order">
<img src={assets.parcel_icon} alt=""/>
<p>{order.items.map((item,index)=>{
if(index===order.items.length-1){
    return item.name+" X "+item.quantity;
}
else{
    return item.name+" X "+item.quantity+",";
}
})}</p>
<p>${order.amount}.00</p>
<p>Items:{order.items.length}</p>
<p><span>&#x25cf;</span><b>{order.status}</b></p>
<button onClick={fetchOrders}>Track Order</button>
                            </div>
                    )
                })}
            </div>
        </div>
    )
}