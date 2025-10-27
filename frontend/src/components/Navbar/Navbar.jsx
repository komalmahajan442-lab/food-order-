import React, { useContext, useState } from 'react';
import "./Navbar.css";
import { assets } from '../../assets/assets';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/storeContext';

const Navbar=({setShowLogin})=>{
    const [menu,setMenu]=useState('Home');
    const {getTotalCartAmount,token,setToken}=useContext(StoreContext);
const navigate=useNavigate();

    const logOut=()=>{
localStorage.removeItem("token")
setToken("");
navigate("/")
    }
    return(
        <div className='navbar'>
<Link to='/'><img src={assets.logo} alt='' className='logo'></img></Link>
<ul className="navbar-menu">
    <Link to='/' onClick={()=>setMenu("Home")} className={menu==='Home'?'active':""}>Home</Link>
    <a href="#explore-menu" onClick={()=>setMenu("Menu")} className= {menu==='Menu'?'active':""}>Menu</a>
    <a href='#app-download' onClick={()=>setMenu("Mobile-app")} className={menu==='Mobile-app'?'active':""}>Mobile-app</a>
    <a href='#footer' onClick={()=>setMenu("contact us")} className={menu==='contact us'?'active':""}>contact us</a>
</ul>
<div className="navbar-right">
    <img src={assets.search_icon} alt=''></img>
    <div className="navbar-search-icon">
      <Link to='/cart' ><img src={assets.basket_icon} alt=''></img></Link> 
        <div className={getTotalCartAmount()===0?"":"dot"}></div>
    </div>
    {!token?<button onClick={()=>setShowLogin(true) }>sign in</button>
    :<div className='navbar-profile'>
        <img src={assets.profile_icon} alt=''/>
        <ul className="nav-profile-dropdown">
            <li onClick={()=>navigate('/myorders')}><img src={assets.bag_icon} alt=''/></li>
            <hr/>
            <li onClick={logOut}><img src={assets.logout_icon} alt=''/></li>
        </ul>
        </div>}
    
</div>
        </div>
    )
}

export default Navbar;