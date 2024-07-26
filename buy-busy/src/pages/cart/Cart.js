import React from "react";
import styles from "./Cart.module.css";
import { useProductContext } from "../../component/context/productContext/ProductContext";
import { useAuthContext } from "../../component/context/authContext/AuthContext";

export default function Cart() {
    const { cartItems, removeCart, handleDecreasedCart, handleIncreadedCart, buy } = useProductContext();
    const { user } = useAuthContext();

    console.log("cartItems in cart: ", cartItems);

    if (!user) {
        return <div>Please log in to view your cart.</div>;
    }

    if (cartItems.length === 0) {
        return <div>Your cart is empty.</div>;
    }


    //========= handle click increased quantity ==============//
    function handleIncreaded(cartItemId){
        handleIncreadedCart(cartItemId, user.id)
    }

    //======== function handle click decreaded quantity in cart ==========//
    function handleDecreased(cartItemId){
        handleDecreasedCart(cartItemId)
    }

    //======== function handle click buy-now button =====================//
    function handleClickBuyNow(){
        buy();
    }

    return (
        <div className={styles.cartSectionWrapper}>
            <div className={styles.totalCartSection}>
                <p>Total Price: <span>{cartItems.reduce((total, item) => total + item.price * item.quantity, 0)}</span></p>
                <button onClick={()=>handleClickBuyNow()} >Buy Now</button>
            </div>
            <div className={styles.cartItemsContainer}>
                {cartItems.map((item) => (
                    <div className={styles.cartBox} key={item.id}>
                        <div className={styles.imageBox}>
                            <img src={item.image} alt={item.name} />
                        </div>
                        <div className={styles.footerCartBox}>
                            <p className={styles.productName}>{item.name}</p>
                            <div className={styles.priceAndQuantity}>
                                <p>${item.price}</p>
                                <p className={styles.quantityControlDiv}>
                                    <i onClick={()=>handleDecreased(item.id)}
                                     className="fa-solid fa-circle-minus"></i>


                                    <span>{item.quantity}</span>
                                    <i onClick={()=>handleIncreaded(item.id)}
                                    className="fa-solid fa-circle-plus"></i>
                                </p>
                            </div>
                            <div className={styles.removeCartBtnDiv}>
                                <button onClick={()=>removeCart(item.id)}>Remove From Cart</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
