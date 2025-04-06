import { Outlet } from "react-router-dom";
import Navbar from "../components/sidebars/Navbar";

const Layout = () => {
  return (
    <div className="h-screen bg-base-200 flex justify-between">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default Layout;
