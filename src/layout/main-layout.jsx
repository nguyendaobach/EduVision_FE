import { Outlet } from "react-router-dom";
import Header from "../component/header/Header.jsx"
import Footer from "../component/footer/Footer.jsx";
import NotificationCenter from "../component/NotificationCenter.jsx";

const MainLayout = () => {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <Header />
            
            {/* Main content area */}
            <main className="flex-1 relative">
                <Outlet />
            </main>
            
            {/* Footer */}
            <Footer />
            
            {/* Notifications - positioned to avoid header */}
            <NotificationCenter />
        </div>
    )
}

export default MainLayout