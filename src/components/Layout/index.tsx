import React, { useContext } from "react";
import { AppContext } from "../../contexts/AppProviderContext";
import Header from "../Header";
import Footer from "../Footer";
import SideBar from "../Sidebar";

type Props = {
  children: React.ReactNode;
};

const Layout: React.FC<Props> = ({ children }) => {
  const { isOpen, setIsOpen } = useContext<any>(AppContext);

  const handleToggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <Header />
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={handleToggleSidebar}
        ></div>
      )}
      <SideBar />
      <div className="p-4 sm:ml-64">
        {children}
        <Footer />
      </div>
    </div>
  );
};
export default Layout;
