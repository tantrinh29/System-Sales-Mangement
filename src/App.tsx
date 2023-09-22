import { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, useNavigate } from "react-router-dom";
import LoadingBar from "react-top-loading-bar";
import { AppContext } from "./contexts/AppProviderContext";
import { AppState } from "./store";
import { AuthenticatedUser } from "./types";
import Login from "./pages/AuthPage";
import Home from "./pages/DashboardPage";
import BrandPage from "./pages/BrandPage";
import CategoryPage from "./pages/CategoryPage";
import AddProduct from "./pages/ProductPage/Add";
import ListProduct from "./pages/ProductPage/List";
import EditProduct from "./pages/ProductPage/Edit";
import ListOrder from "./pages/OrderPage";
import BlogPage from "./pages/BlogPage";
import CouponPage from "./pages/CouponPage";
import UserPage from "./pages/UserPage";
import CommentPage from "./pages/CommentPage";
import NotFoundPage from "./pages/NotFoundPage";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import { CUSTOM_ENV } from "./utils/custom.env";
import { addNotification } from "./store/notification/actions";
import PromotionPage from "./pages/PromotionPage";
import PaymentPage from "./pages/PaymentPage";
import BannerPage from "./pages/BannerPage";
function App() {
  const { loadingBarProgress, setLoadingBarProgress } =
    useContext<any>(AppContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(
    (state: AppState) => state.auth.user
  ) as AuthenticatedUser;

  useEffect(() => {
    const socket = io(CUSTOM_ENV.API_URL);
    socket.on("connect", () => {
      socket.emit("login", { userId: user.id });

      const socketEventHandlers = [
        { event: "message", action: (message: any) => console.log(message) },
        {
          event: "created_brand",
          action: (message: any) => handleSocketEvent(message),
        },
        {
          event: "updated_brand",
          action: (message: any) => handleSocketEvent(message),
        },
        {
          event: "deleted_brand",
          action: (message: any) => handleSocketEvent(message),
        },
        {
          event: "created_product",
          action: (message: any) => handleSocketEvent(message),
        },
        {
          event: "updated_product",
          action: (message: any) => handleSocketEvent(message),
        },
        {
          event: "deleted_product",
          action: (message: any) => handleSocketEvent(message),
        },
        {
          event: "created_category",
          action: (message: any) => handleSocketEvent(message),
        },
        {
          event: "updated_category",
          action: (message: any) => handleSocketEvent(message),
        },
        {
          event: "deleted_category",
          action: (message: any) => handleSocketEvent(message),
        },
        {
          event: "created_coupon",
          action: (message: any) => handleSocketEvent(message),
        },
        {
          event: "updated_coupon",
          action: (message: any) => handleSocketEvent(message),
        },
        {
          event: "deleted_coupon",
          action: (message: any) => handleSocketEvent(message),
        },
        {
          event: "created_blog",
          action: (message: any) => handleSocketEvent(message),
        },
        {
          event: "updated_blog",
          action: (message: any) => handleSocketEvent(message),
        },
        {
          event: "deleted_blog",
          action: (message: any) => handleSocketEvent(message),
        },
        {
          event: "created_order",
          action: (message: any) => handleSocketEvent(message),
        },
        {
          event: "updated_order",
          action: (message: any) => handleSocketEvent(message),
        },
        {
          event: "deleted_order",
          action: (message: any) => handleSocketEvent(message),
        },
        {
          event: "login_user",
          action: (message: any) => handleSocketEvent(message),
        },
        {
          event: "created_user",
          action: (message: any) => handleSocketEvent(message),
        },
        {
          event: "updated_user",
          action: (message: any) => handleSocketEvent(message),
        },
        {
          event: "deleted_user",
          action: (message: any) => handleSocketEvent(message),
        },
      ];
      socketEventHandlers.forEach((handler) => {
        socket.on(handler.event, (message: any) => handler.action(message));
      });
    });

    const handleSocketEvent = (message: any) => {
      // Thêm tham số eventName
      const id = uuidv4();
      dispatch(addNotification(id, message));
    };

    // Clean up the socket
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (user) {
      if (user.role === "ADMIN" && user.verify == 1) {
        navigate("/");
      } else {
        navigate("/auth");
      }
    } else {
      navigate("/auth");
    }
  }, [user]);

  return (
    <>
      <LoadingBar
        color="#3b82f6"
        progress={loadingBarProgress}
        waitingTime={700}
        onLoaderFinished={() => setLoadingBarProgress(0)}
      />
      <Routes>
        {user && user.role === "ADMIN" && user.verify == 1 ? (
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
              element={
                <BrandPage setLoadingBarProgress={setLoadingBarProgress} />
              }
            />
            <Route
              path="/products"
              element={
                <ListProduct setLoadingBarProgress={setLoadingBarProgress} />
              }
            />
            <Route
              path="/product/add"
              element={
                <AddProduct setLoadingBarProgress={setLoadingBarProgress} />
              }
            />
            <Route
              path="/product/edit/:slug"
              element={
                <EditProduct setLoadingBarProgress={setLoadingBarProgress} />
              }
            />
            <Route
              path="/orders"
              element={
                <ListOrder setLoadingBarProgress={setLoadingBarProgress} />
              }
            />
             <Route
              path="/banners"
              element={
                <BannerPage setLoadingBarProgress={setLoadingBarProgress} />
              }
            />
            <Route
              path="/blogs"
              element={
                <BlogPage setLoadingBarProgress={setLoadingBarProgress} />
              }
            />
            <Route
              path="/promotions"
              element={
                <PromotionPage setLoadingBarProgress={setLoadingBarProgress} />
              }
            />
            <Route
              path="/coupons"
              element={
                <CouponPage setLoadingBarProgress={setLoadingBarProgress} />
              }
            />

            <Route
              path="/users"
              element={
                <UserPage setLoadingBarProgress={setLoadingBarProgress} />
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

            <Route path="*" element={<NotFoundPage />} />
          </>
        ) : (
          <>
            <Route path="/auth" element={<Login />} />
            <Route path="*" element={<Login />} />
          </>
        )}
      </Routes>
    </>
  );
}

export default App;
