import React, { createContext, useContext, useState, useEffect } from "react";
import { db } from "../../../firebaseInit";
import { collection, addDoc, updateDoc, doc, deleteDoc, onSnapshot, query, where, writeBatch } from "firebase/firestore";
import data from "../../../pages/home/data";
import { useAuthContext } from "../authContext/AuthContext";
import { toast } from "react-toastify";

const productContext = createContext();

// Function to access product context
export function useProductContext() {
    return useContext(productContext);
}

// Custom provider for product context
export function ProductContextProvider({ children }) {
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const { user } = useAuthContext();
    const [orderData, setOrderData] = useState([]);
    

    // Fetch cart items from Firestore on mount
    useEffect(() => {
        if (user) {
            const q = query(collection(db, "cartItems"), where("user", "==", user.id));
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setCartItems(items);
            });
            return unsubscribe;
        }
    }, [user]);

    //====== fetch order daetls of user when components is mount =======//
     useEffect(() => {
        if (user) {
            const q = query(collection(db, "orders"), where("user", "==", user.id));
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setOrderData(orders);
            });
            return unsubscribe;
        }
    }, [user]);



    // Function to add to cart
    async function addCart(productId, userId) {
        const findProduct = data.find((prod) => prod.id === productId);
        if (!findProduct) return false;

        const isInCart = cartItems.find((cartItem) => cartItem.productId === productId && cartItem.user === userId);
        console.log("isInCart: ", isInCart);

        try {
            if (isInCart) {
                const cartRef = doc(db, "cartItems", isInCart.id);
                await updateDoc(cartRef, { quantity: isInCart.quantity + 1 });
                toast.success(`${isInCart.name} added in cart`);
            } else {
                const {id, ...remaningProd} = findProduct;
                console.log("remaningProd: ", remaningProd);
                await addDoc(collection(db, "cartItems"), { ...remaningProd, user: userId, productId:id, quantity: 1 });
                toast.success(`${findProduct.name} is added in cart!`)
            }
        } catch (error) {
            console.error("Error updating cart:", error);
            toast.error("Failds to add in cart!")
        }
    }


    //========= handle click increased quantity ==============//
   async function handleIncreadedCart(cartItemId, userId){
        //====== it should increased quantity in the cart ====//
        const cartItem = cartItems.find(item => item.id === cartItemId && item.user === userId);
        if (cartItem) {
            const cartRef = doc(db, "cartItems", cartItemId);
            try {
                await updateDoc(cartRef, { quantity: cartItem.quantity + 1 });
                toast.success(`${cartItem.name} is added in cart!`)
            } catch (error) {
                console.error("Error increasing quantity in cart:", error);
                toast.error("Failds to add in cart!")
            }
        }



    }

    //======== function handle click decreaded quantity in cart ==========//
   async function handleDecreasedCart(cartItemId){
        const cartItem = cartItems.find(item => item.id === cartItemId);
        if (cartItem) {
            const cartRef = doc(db, "cartItems", cartItemId);
            try {
                if (cartItem.quantity > 1) {
                    await updateDoc(cartRef, { quantity: cartItem.quantity - 1 });
                    toast.success(`${cartItem.name} is removed by 1`)
                } else {
                    await deleteDoc(cartRef);
                    toast.success(`${cartItem.name} is removed from cart!`)

                }
            } catch (error) {
                console.error("Error decreasing quantity in cart:", error);
                toast.error("Failds to removed from cart!");
            }
        }
        
    }


    // Function to remove from cart
    async function removeCart(cartItemId) {
        const cartRef = doc(db, "cartItems", cartItemId);
        await deleteDoc(cartRef);
    }

    //========= function buy now ===============//
    // Function to handle buy now
async function buy() {
    if (user) {
        const currentDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
        const orderItems = cartItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            name: item.name,
            image: item.image
        }));

        const order = {
            user: user.id,
            date: currentDate,
            status: "pending",
            items: orderItems
        };

        try {
            const orderRef = await addDoc(collection(db, "orders"), order);

            // Remove items from cart
            const batch = writeBatch(db);
            cartItems.forEach(item => {
                const cartRef = doc(db, "cartItems", item.id);
                batch.delete(cartRef);
            });

            await batch.commit();
            setCartItems([]);
            console.log("Order created with ID: ", orderRef.id);

            // Append new order to the orderData state array
            setOrderData(prevOrders => [
                ...prevOrders,
                {
                    id: orderRef.id,
                    ...order
                }
            ]);

            toast.success("Your order is done sucessfully!");
        } catch (error) {
            console.error("Error processing order:", error);
            toast.error("Failds to buy product!");
        }
    }
}
   

    return (
        <productContext.Provider value={{ addCart, removeCart, products, setProducts,
        cartItems, setCartItems, handleDecreasedCart, handleIncreadedCart, buy, orderData }}>
            {children}
        </productContext.Provider>
    );
}
