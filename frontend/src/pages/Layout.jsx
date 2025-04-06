import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Layout = () => {
  
  return (
    <div className="h-screen bg-base-200">
      <Navbar />
      <Outlet />
    </div>
  )
}

export default Layout