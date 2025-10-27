import userModel from "../models/userModel.js"

//add item to user cart
export const addToCart=async (req,res)=>{
    const userId=req.user?.id;

    if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

    try{
let userData=await userModel.findById(userId);
let cartData=await userData.cartData;
if(!cartData[req.body.itemId]){
    cartData[req.body.itemId]=1;
}
else{
    cartData[req.body.itemId]+=1;
}
await userModel.findByIdAndUpdate(req.body.userId,{cartData});
res.json({success:true,message:"Added To Cart"})
    }catch(error){
console.log(error);
res.json({success:false,message:"Some Error Occured"})
    }
}

//remove items from user cart
export const removeFromCart=async(req,res)=>{
try{
let userData=await userModel.findById(req.body.userId);
let cartData=await userModel.cartData;
if(cartData[req.body.itemId]>0){
    cartData[req.body.itemId]-=1;
}
await userModel.findByIdAndUpdate(req.body.userId,{cartData});
res.json({success:true,message:"Removed From Cart"});
}catch(error){
console.log(error);
res.json({success:false,message:"Error"})
}
}

//fetch to the cart data
export const getCart=async(req,res)=>{
try {
    if (!req.user) {
        return res.status(401).json({ error: "Unauthorized - user not found in request" });
      }
      
      const userId = req.user.id;
      
    let userData=await userModel.findById(req.user.id);
    let cartData=await userData.cartData;
    res.json({success:true},cartData);
} catch (error) {
    console.log(error);
res.json({success:false,message:"Error"})
}
}

