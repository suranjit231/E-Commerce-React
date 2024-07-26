import React, { useEffect, useState } from "react";
import styles from "./Sidebar.module.css";
import { useProductContext } from "../context/productContext/ProductContext";
import data from "../../pages/home/data";

export default function SideBar({ isShowSidebar, handleToggleSidebar }) {
    const [isVisible, setIsVisible] = useState(false);
    const [price, setPrice] = useState(100);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const { products, setProducts } = useProductContext();

    useEffect(() => {
        setIsVisible(isShowSidebar);
    }, [isShowSidebar]);

    const handlePriceChange = (event) => {
        setPrice(event.target.value);
    };

    const handleCategoryChange = (event) => {
        const { value, checked } = event.target;
        setSelectedCategories(prevCategories =>
            checked
                ? [...prevCategories, value]
                : prevCategories.filter(category => category !== value)
        );
    };

    const handleApplyFilters = (event) => {
        event.preventDefault();

        const filteredProducts = data.filter(product => {
            const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
            const matchesPrice = price === 100 ? true : product.price <= price; // Default price to include all if not changed
            return matchesCategory && matchesPrice;
        });

        setProducts(filteredProducts);
    };

    return (
        <div className={`${styles.sidebarContainer} ${isVisible ? styles.sidebarVisible : ""}`}>
            <i onClick={handleToggleSidebar} 
                className={`fa-solid fa-xmark ${styles.closeSidebar}`}></i>

            <div className={styles.sideBarWrapper}>
                <div className={styles.filterheader}>
                    <span><i className="fa-solid fa-filter-circle-dollar"></i></span>
                    <span>Filter</span>
                </div>

                <form onSubmit={handleApplyFilters}>
                    <div className={styles.priceRangeDiv}>
                        <label htmlFor="priceRange">Price: {price}</label>
                        <input
                            type="range"
                            id="priceRange"
                            min="100"
                            max="100000"
                            value={price}
                            onChange={handlePriceChange}
                            className={styles.priceRangeInput}
                        />
                    </div>

                    <div className={styles.categoryFilterDiv}>
                        <p>Category</p>

                        <div>
                            <label htmlFor="mans-cloth">
                                <input
                                    type="checkbox"
                                    id="mans-cloth"
                                    value="Men's Clothing"
                                    checked={selectedCategories.includes("Men's Clothing")}
                                    onChange={handleCategoryChange}
                                />
                                Man's Clothing
                            </label>
                        </div>

                        <div>
                            <label htmlFor="womens-cloth">
                                <input
                                    type="checkbox"
                                    id="womens-cloth"
                                    value="Women's Clothing"
                                    checked={selectedCategories.includes("Women's Clothing")}
                                    onChange={handleCategoryChange}
                                />
                                Women's Clothing
                            </label>
                        </div>

                        <div>
                            <label htmlFor="electronics">
                                <input
                                    type="checkbox"
                                    id="electronics"
                                    value="Electronics"
                                    checked={selectedCategories.includes("Electronics")}
                                    onChange={handleCategoryChange}
                                />
                                Electronics
                            </label>
                        </div>

                        <div>
                            <label htmlFor="jewelry">
                                <input
                                    type="checkbox"
                                    id="jewelry"
                                    value="Jewelry"
                                    checked={selectedCategories.includes("Jewelry")}
                                    onChange={handleCategoryChange}
                                />
                                Jewelry
                            </label>
                        </div>
                    </div>

                    <div className={styles.applyFilter}>
                        <button type="submit">Apply</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
