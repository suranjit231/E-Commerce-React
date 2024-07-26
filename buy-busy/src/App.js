import Navbar from "./component/navbar/Navbar";
import Home from "./pages/home/Home";
import Auth from "./pages/auth/authForm";
import { AuthContextProvider } from "./component/context/authContext/AuthContext";
import { ProductContextProvider } from "./component/context/productContext/ProductContext";
import {createBrowserRouter, RouterProvider, Navigate} from "react-router-dom";
import Cart from "./pages/cart/Cart";
import Order from "./pages/buy/Order";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PrivateRoute from "./component/context/authContext/PrivateRoute";
import Page404 from "./pages/errorPage/Page404";


function App() {

  
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Navbar />,
      children: [
        { index: true, element: <Home /> },
        { path: "auth", element: <Auth /> },
        { path: "cart/:userId", element: (
          <PrivateRoute>
            <Cart />
          </PrivateRoute>
        )},
        { path: "order/:userId", element: (
          <PrivateRoute>
            <Order />
          </PrivateRoute>
        )},

        { path: "*", element: <Page404 /> }
        
      ]
    }
  ]);

  return (
    <div className="App">
      <AuthContextProvider>
        <ProductContextProvider>
          <RouterProvider router={router} />
        </ProductContextProvider>
      </AuthContextProvider>
      <ToastContainer/>
    </div>
  );
}

export default App;
