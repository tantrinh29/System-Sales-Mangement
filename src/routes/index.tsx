import { Route } from "react-router-dom";
import Home from "../pages/DashboardPage";
import CategoryPage from "../pages/CategoryPage";
import NotFoundPage from "../pages/NotFoundPage";
import Login from "../pages/AuthPage";
import PaymentPage from "../pages/PaymentPage";
import BrandPage from "../pages/BrandPage";
import ListProduct from "../pages/ProductPage/List";
import EditProduct from "../pages/ProductPage/Edit";
import AddProduct from "../pages/ProductPage/Add";
import AddOrder from "../pages/OrderPage/Add";
import ListOrder from "../pages/OrderPage/List";
import BannerPage from "../pages/BannerPage";
import BlogPage from "../pages/BlogPage";
import CouponPage from "../pages/CouponPage";
import CouponUserPage from "../pages/CouponUserPage";
import UserPage from "../pages/UserPage";
import CommentPage from "../pages/CommentPage";
import ChatPage from "../pages/ChatPage";

export default function getUserRoutes(user: any, setLoadingBarProgress: any) {
  if (user && user.role === "ADMIN" && user.verify == 1) {
    return (
      <>
        <Route
          path="/"
          element={<Home setLoadingBarProgress={setLoadingBarProgress} />}
        />
        <Route
          path="/categories"
          element={
            <CategoryPage setLoadingBarProgress={setLoadingBarProgress} />
          }
        />
        <Route
          path="/brands"
          element={<BrandPage setLoadingBarProgress={setLoadingBarProgress} />}
        />
        <Route
          path="/products"
          element={
            <ListProduct setLoadingBarProgress={setLoadingBarProgress} />
          }
        />
        <Route
          path="/product/add"
          element={<AddProduct setLoadingBarProgress={setLoadingBarProgress} />}
        />
        <Route
          path="/product/edit/:slug"
          element={
            <EditProduct setLoadingBarProgress={setLoadingBarProgress} />
          }
        />
        <Route
          path="/orders"
          element={<ListOrder setLoadingBarProgress={setLoadingBarProgress} />}
        />
           <Route
          path="/order/add"
          element={<AddOrder setLoadingBarProgress={setLoadingBarProgress} />}
        />
        <Route
          path="/banners"
          element={<BannerPage setLoadingBarProgress={setLoadingBarProgress} />}
        />
        <Route
          path="/blogs"
          element={<BlogPage setLoadingBarProgress={setLoadingBarProgress} />}
        />
    
        <Route
          path="/coupons"
          element={<CouponPage setLoadingBarProgress={setLoadingBarProgress} />}
        />
        <Route
          path="/discounts"
          element={
            <CouponUserPage setLoadingBarProgress={setLoadingBarProgress} />
          }
        />

        <Route
          path="/users"
          element={<UserPage setLoadingBarProgress={setLoadingBarProgress} />}
        />

        <Route
          path="/comments"
          element={
            <CommentPage setLoadingBarProgress={setLoadingBarProgress} />
          }
        />
        <Route
          path="/payments"
          element={
            <PaymentPage setLoadingBarProgress={setLoadingBarProgress} />
          }
        />
        <Route
          path="/chats"
          element={<ChatPage setLoadingBarProgress={setLoadingBarProgress} />}
        />

        <Route path="*" element={<NotFoundPage />} />
      </>
    );
  } else if (user && user.role === "EMPLOYEE" && user.verify == 1) {
    return (
      <>
        <Route
          path="/"
          element={<Home setLoadingBarProgress={setLoadingBarProgress} />}
        />
        <Route
          path="/categories"
          element={
            <CategoryPage setLoadingBarProgress={setLoadingBarProgress} />
          }
        />
        <Route
          path="/brands"
          element={<BrandPage setLoadingBarProgress={setLoadingBarProgress} />}
        />
        <Route
          path="/products"
          element={
            <ListProduct setLoadingBarProgress={setLoadingBarProgress} />
          }
        />
        <Route
          path="/product/add"
          element={<AddProduct setLoadingBarProgress={setLoadingBarProgress} />}
        />
        <Route
          path="/product/edit/:slug"
          element={
            <EditProduct setLoadingBarProgress={setLoadingBarProgress} />
          }
        />
        <Route
          path="/orders"
          element={<ListOrder setLoadingBarProgress={setLoadingBarProgress} />}
        />
        <Route
          path="/banners"
          element={<BannerPage setLoadingBarProgress={setLoadingBarProgress} />}
        />
        <Route
          path="/blogs"
          element={<BlogPage setLoadingBarProgress={setLoadingBarProgress} />}
        />
     
        <Route
          path="/coupons"
          element={<CouponPage setLoadingBarProgress={setLoadingBarProgress} />}
        />
        <Route
          path="/discounts"
          element={
            <CouponUserPage setLoadingBarProgress={setLoadingBarProgress} />
          }
        />
        <Route
          path="/comments"
          element={
            <CommentPage setLoadingBarProgress={setLoadingBarProgress} />
          }
        />
        <Route
          path="/payments"
          element={
            <PaymentPage setLoadingBarProgress={setLoadingBarProgress} />
          }
        />
        <Route
          path="/chats"
          element={<ChatPage setLoadingBarProgress={setLoadingBarProgress} />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </>
    );
  } else {
    return (
      <>
        <Route path="/auth" element={<Login />} />
        <Route path="*" element={<Login />} />
      </>
    );
  }
}
