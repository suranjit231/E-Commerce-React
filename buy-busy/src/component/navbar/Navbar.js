import React, { useState, useEffect, useRef } from "react";
import styles from "./Navbar.module.css";
import SideBar from "../sidebar/Sidebar";
import AuthForm from "../../pages/auth/authForm";
import { useAuthContext } from "../context/authContext/AuthContext";
import { Link, Outlet } from "react-router-dom";
import { useProductContext } from "../context/productContext/ProductContext";
import data from "../../pages/home/data";

export default function Navbar() {
    const [showSearch, setShowSearch] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 820);
    const [isShowSidebar, setShowSidebar] = useState(false);
    const [searchText, setSearchText] = useState("");
    const searchRef = useRef();
    const debounceTimeout = useRef(null);

    const { isLoggedIn, user, isShowAuth, setShowAuthForm, logoutUser } = useAuthContext();
    const { cartItems, products, setProducts } = useProductContext();

    //======= handle responsiveness for search bar =============//
    const handleResize = () => {
        setIsMobile(window.innerWidth < 820);
        if (window.innerWidth >= 820) {
            setShowSearch(false);
        }
    };

    useEffect(() => {
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        if (showSearch) {
            searchRef.current.focus();
        }
    }, [showSearch]);

    //======== searching for a product =================//
    // Search function
    const filterProductsByName = (text) => {
        const regex = new RegExp(text, 'i'); // Case-insensitive search
        const filteredProducts = data.filter((product) => regex.test(product.name));
        setProducts(filteredProducts);
    };

    // ======== handle searching for a product =========//
    const handleSearchTextChange = (text) => {
        setSearchText(text);
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }
        debounceTimeout.current = setTimeout(() => {
            filterProductsByName(text);
        }, 500); 
    };

    //======= toggle responsive search bar =============//
    function toggleResponsiveSearch() {
        if (isShowSidebar) {
            setShowSidebar((prev) => !prev);
            setShowSearch((prev) => !prev);
        } else {
            setShowSearch((prev) => !prev);
        }
    }

    //======= handle toggle side bar ===================//
    function handleToggleSidebar() {
        if (!isMobile) {
            setShowSidebar((prev) => !prev);
        } else if (isMobile && showSearch) {
            setShowSearch(false);
            setShowSidebar((prev) => !prev);
        } else {
            setShowSidebar((prev) => !prev);
        }
    }

    return (
        <>
            <div className={styles.navWrapper}>
                <div className={styles.navContainer}>
                    <div className={styles.leftNavbar}>
                        <p>Busy Buy</p>
                    </div>

                    {!isMobile ? (
                        <div className={styles.searchDiv}>
                            <input
                                type="text"
                                name="search"
                                value={searchText}
                                onChange={(e) => handleSearchTextChange(e.target.value)}
                                placeholder="Search..."
                            />
                            <i className={`fa-solid fa-magnifying-glass ${styles.searchIcon}`}></i>
                        </div>
                    ) : (
                        <div>
                            <i
                                onClick={() => toggleResponsiveSearch()}
                                className={`fa-solid fa-magnifying-glass ${styles.searchIconRes}`}
                            ></i>
                        </div>
                    )}

                    <div className={styles.rightNavbar}>
                        <div className={styles.homeDiv}>
                            <Link to="/">
                                <i className="fa-solid fa-house"></i>
                            </Link>
                        </div>

                        {isLoggedIn ? (
                            <>
                                <div className={styles.orderDiv}>
                                    <Link to={`/order/${user.id}`}>
                                        <i className="fa-solid fa-store"></i>
                                    </Link>
                                </div>

                                <div className={styles.cartDiv}>
                                    <Link to={`/cart/${user.id}`}>
                                        <i className="fa-solid fa-cart-shopping"></i>
                                        <p className={styles.countCartItem}>{cartItems.length}</p>
                                    </Link>
                                </div>

                                <div className={styles.loginDiv}>
                                    <i onClick={() => logoutUser()} className="fa-solid fa-right-from-bracket"></i>
                                </div>
                            </>
                        ) : (
                            <div className={styles.loginDiv}>
                                <Link to="/auth">
                                    <i className="fa-solid fa-right-to-bracket"></i>
                                </Link>
                            </div>
                        )}

                        <div className={styles.menuDiv}>
                            <i onClick={() => handleToggleSidebar()} className="fa-solid fa-bars"></i>
                        </div>
                    </div>
                </div>

                {isMobile && (
                    <div className={styles.responsiveSearchContainer}>
                        {showSearch && (
                            <div className={`${styles.responsiveSearchDiv} ${styles.show}`}>
                                <input
                                    ref={searchRef}
                                    onChange={(e) => handleSearchTextChange(e.target.value)}
                                    value={searchText}
                                    type="text"
                                    placeholder="Search..."
                                />
                                <i
                                    className="fa-solid fa-xmark"
                                    onClick={() => setShowSearch(false)}
                                ></i>
                            </div>
                        )}
                    </div>
                )}

                {isShowSidebar && <SideBar isShowSidebar={isShowSidebar} handleToggleSidebar={handleToggleSidebar} />}
            </div>

            {isShowAuth ? <AuthForm /> : null}

            <Outlet />
        </>
    );
}
