import React, { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../context/storeContext';
import './Placeorder.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Placeorder = () => {
  
  const { getTotalCartAmount, token, food_list, cartItems, API_URL } = useContext(StoreContext);

  const [data, setdata] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: ''
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setdata((prev) => ({ ...prev, [name]: value }));
  };

  const placeorder = async (event) => {
    event.preventDefault();
console.log("placeorder function called");
    // ✅ Build order items from cart
    const orderItems = food_list
      .filter((item) => cartItems[item._id] > 0)
      .map((item) => ({
        ...item,
        quantity: cartItems[item._id]
      }));

    // ✅ Return if no items
    if (orderItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    const orderData = {
      userId: localStorage.getItem('userId'),
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 2
    };

    try {

      console.log(`starting api call ${url}/api/order/place`);
      const response = await axios.post(`${url}/api/order/place`, orderData, {
        headers: { token },
       
      });
      console.log("backend response",response.data);

      if (response.data.success) {
        const { key, orderId, amount, currency } = response.data;

        const options = {
          key,
          amount,
          currency,
          name: 'Food Order',
          description: 'Payment for food order',
          order_id: orderId,
          handler: function (res) {
            // TODO: OPTIONAL - Send res.razorpay_payment_id etc. to backend for verification

            
            window.location.href = '/verify?success=true';
          },
          prefill: {
            name: `${data.firstName} ${data.lastName}`,
            email: data.email,
            contact: data.phone
          },
          notes: {
            address: `${data.street}, ${data.city}, ${data.state}, ${data.country}`
          },
          theme: {
            color: '#3399cc'
          }
        };

        const razor = new window.Razorpay(options);
        console.log("opening Razorpopo");
        razor.open();
      } else {
        alert('Something went wrong while placing the order.',response.data);
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred during order placement.');
    }
  };

  const navigate=useNavigate();
  useEffect(()=>{
if(!token){
navigate('/cart');
}else if(getTotalCartAmount()===0){
  navigate('/cart');
}
  },[token])
  return (
    <form onSubmit={placeorder} className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input required name="firstName" onChange={onChangeHandler} value={data.firstName} type="text" placeholder="First Name" />
          <input required name="lastName" onChange={onChangeHandler} value={data.lastName} type="text" placeholder="Last Name" />
        </div>
        <input required name="email" onChange={onChangeHandler} value={data.email} type="email" placeholder="Email address" />
        <input required name="street" onChange={onChangeHandler} value={data.street} type="text" placeholder="Street" />
        <div className="multi-fields">
          <input required name="city" onChange={onChangeHandler} value={data.city} type="text" placeholder="City" />
          <input required name="state" onChange={onChangeHandler} value={data.state} type="text" placeholder="State" />
        </div>
        <div className="multi-fields">
          <input required name="zipcode" onChange={onChangeHandler} value={data.zipcode} type="text" placeholder="Zip code" />
          <input required name="country" onChange={onChangeHandler} value={data.country} type="text" placeholder="Country" />
        </div>
        <input required name="phone" onChange={onChangeHandler} value={data.phone} type="text" placeholder="Phone" />
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₹{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>₹{getTotalCartAmount() === 0 ? 0 : 2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>₹{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</b>
            </div>
          </div>
          <button type="submit" onClick={()=>console.log("button clicked")}>PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  );
};

export default Placeorder;
