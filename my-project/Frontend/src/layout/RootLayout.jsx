import React from "react";
import Header from "../components/Index/Header";
import Footer from "../components/Index/Footer";
import { Outlet } from "react-router-dom";
import Topbar from "../components/Index/Topbar";
//import CopyrightFooter from "../components/Index/Copyright";
import BackToTopButton from "../components/Index/BTB";
function RootLayout() {

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="flex-1 flex flex-col">

        <Topbar />
        <Header />
        <main className="flex-1 p-6">
          <Outlet />
        </main>

        <Footer />
        {/* <CopyrightFooter /> */}
        <BackToTopButton />
      </div>
    </div>
  );
}

export default RootLayout;