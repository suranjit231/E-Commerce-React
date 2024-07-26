import styles from "./Order.module.css";
import { useProductContext } from "../../component/context/productContext/ProductContext";
import { useAuthContext } from "../../component/context/authContext/AuthContext";

export default function Order() {
    const { orderData } = useProductContext();
    const { user } = useAuthContext();

    console.log("orderData: ", orderData);

    if (!user) {
        return <div>Please log in to view your Order.</div>;
    }

    if (!orderData || orderData.length === 0) {
        return <div>You haven't any existing order</div>;
    }

    return (
        <div className={styles.buyContainer}>
            <h2>Your Order</h2>

            {orderData.map((ord) => {
                // Calculate grand total for the order
                const grandTotal = ord.items.reduce((total, item) => total + item.price * item.quantity, 0);

                return (
                    <div key={ord.id} className={styles.tableWrapper}>
                        <h3>Order On: {ord.date}</h3>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Total Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ord.items.map((item) => (
                                    <tr key={item.productId}>
                                        <td data-label="Title">{item.name}</td>
                                        <td data-label="Price">{item.price}</td>
                                        <td data-label="Quantity">{item.quantity}</td>
                                        <td data-label="Total Price">${item.price * item.quantity}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan="3" data-label="Grand Total">Grand Total</td>
                                    <td data-label="Total">${grandTotal}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                );
            })}
        </div>
    );
}
