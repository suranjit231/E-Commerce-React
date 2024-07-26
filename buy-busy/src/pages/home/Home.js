import React, { useEffect, useState } from "react";
import styles from "./Home.module.css";
import data from "./data";
import { useProductContext } from "../../component/context/productContext/ProductContext";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../component/context/authContext/AuthContext";

export default function Home(){
    const navigate = useNavigate();
   const {addCart, products, setProducts} = useProductContext();
    const {isLoggedIn , user} = useAuthContext();

   // console.log("isLogin in home: ", isLoggedIn, user);

   useEffect(()=>{
        setProducts(data)

   },[]);


   //========== function handle click add to cart ==========//
   function handleClickAddToCart(productId){
        if(!isLoggedIn) return navigate("/auth");
        addCart(productId, user.id);
   }



    return(
        <div className={styles.homeContainer}>

            {products.map((prod)=>{
                return(
                    <div key={prod.id} className={styles.productBox}>

                <div className={styles.imageBox}>
                        <img src={prod.image} alt="Product1" />
                </div>
                <div className={styles.productFooter}>
                    <p>{prod.name}</p>
                    <p>$ {prod.price}</p>
                    
                    <div className={styles.cartBtnDiv}>
                            <button onClick={()=>handleClickAddToCart(prod.id)} >Add to Cart</button>
                    </div>
                </div>

                    </div>

                )
            })}

        </div>
    )
}
