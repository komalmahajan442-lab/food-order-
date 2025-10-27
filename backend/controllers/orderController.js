//import products from "razorpay/dist/types/products.js";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});



// Place user Order from frontend
export const placeOrder = async (req, res) => {
 console.log("Auth user",req.user);
  
  try {
    const {  items, amount, address } = req.body;

    // 1. Save order to DB
    const newOrder = new orderModel({
      userId:req.user._id,
      items:req.body.items,
      amount:req.body.amount,
      address:req.body.address,
    });
    await newOrder.save();

    if (!req.user?._id || !items || !amount || !address) {
      console.log("Missing fields:", { userId:req.user?._id, items, amount, address });
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }
    
    // 2. Clear user cart (if cartData exists in schema)
    await userModel.findByIdAndUpdate(req.user._id, { cartData: {} });

    const line_items=req.body.items.map((item)=>({
      price_data:{
        currency:"INR",
        product_data:{
          name:item.name
        },
        unit_amount:item.price*100
      },
      quantity:item.quantity
    }))

    line_items.push({
      price_data:{
        currency:"INR",
        product_data:{
          name:"Delivery Charges"
        },
        unit_amount:2*100
      },
      quantity:1
    })
    // 3. Create Razorpay Order
    const razorpayOrder = await razorpay.orders.create({
     
      amount: amount * 100, // Razorpay expects amount in paise
      currency: "INR",
      receipt: `receipt_${newOrder._id}`,
    });

    res.json({
      success: true,
      orderId: razorpayOrder.id,
      key: process.env.RAZORPAY_KEY_ID,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ success: false, message: error.message});
  }
};

export const verifyOrder=async(req,res)=>{
const {orderId,success}=req.body;
try{
  if (success=="true"){
    await orderModel.findByIdAndUpdate(orderId,{payment:true});
    res.json({success:true,message:"Paid"});
  }else{
    await orderModel.findByIdAndDelete(orderId);
    res.json({success:false,message:"Not Paid"})
  }
}catch(error){
  console.log(error);
  res.json({success:false,message:error.message})
}
}
//user order for frontend
export const userOrder=async(req,res)=>{
try {
 const userId=req.user?._id;
 if (!userId) {
  throw new Error("User not authenticated");
}
  const orders=await orderModel.find({userId});
  res.json({success:true,data:orders})
} catch (error) {
  console.log(error);
  res.json({success:false,message:error.message})
}
}

//listing orders for admin panel
export const listOrders=async(req,res)=>{

try {
  const orders=await orderModel.find({});
  res.json({success:true,data:orders});
} catch (error) {
  console.log(error);
  res.json({success:false,message:"Error"})
}
}

//api for updating order status
export  const updateStatus=async(req,res)=>{
try {
  await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status})
  res.json({success:true,message:"Status Updated"})
} catch (error) {
  console.log(error);
  res.json({success:false,message:"Error"})
}
}