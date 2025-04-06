import { Outlet } from "react-router-dom";
import Navbar from "../components/sidebars/Navbar";
import RightSidebar from "../components/sidebars/RightSidebar";

const Layout = () => {
  return (
    <div className="h-screen bg-base-200 flex justify-between">
      <Navbar />
      <Outlet />
      <RightSidebar />
    </div>
  );
};

export default Layout;
