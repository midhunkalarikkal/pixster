import { Outlet } from "react-router-dom";
import Navbar from "../components/sidebars/Navbar";
import MobileBottomBar from "../components/sidebars/MobileBottomBar";
import MobileTopBar from "../components/sidebars/MobileTopBar";

const Layout = () => {
  return (
    <div className="h-screen bg-base-100 flex flex-col md:flex-row justify-between">
      <MobileTopBar />
      <Navbar />
      <Outlet />
      <MobileBottomBar />
    </div>
  );
};

export default Layout;
