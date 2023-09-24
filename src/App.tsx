import { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, useNavigate } from "react-router-dom";
import LoadingBar from "react-top-loading-bar";
import { AppContext } from "./contexts/AppProviderContext";
import { AppState } from "./store";
import { AuthenticatedUser } from "./types";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import { CUSTOM_ENV } from "./utils/custom.env";
import { addNotification } from "./store/notification/actions";
import getUserRoutes from "./routes";
function App() {
  const allowedRoles = ["ADMIN", "STAFF"];
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
      socket.emit("login", { userId: user._id });

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
      if (allowedRoles.includes(user.role) && user.verify == 1) {
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
      <Routes>{getUserRoutes(user, setLoadingBarProgress)}</Routes>
    </>
  );
}

export default App;
