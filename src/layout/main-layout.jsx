import { Outlet } from "react-router-dom";
import Header from "../component/header/Header.jsx"
import Footer from "../component/footer/Footer.jsx";
const MainLayout = () => {
    return (
         <>
       <div className="main-layout-container">
        <div className="main-layout-header">
          <Header />
        </div>
        <div className="main-layout-content">
          <Outlet />
        </div>
        <div className="main-layout-footer">
          <Footer />
        </div>
      </div>
      </>
    )
}

export default MainLayout