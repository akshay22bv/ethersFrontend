import React, { ReactNode } from "react";
import Topbar from "./common/Topbar";
import Sidebar from "./common/Sidebar"; // Assuming this is the path to your Sidebar component
import DashboardIcon from "@mui/icons-material/Dashboard";
type Props = {
  children: ReactNode;
};

const Layout = ({ children }: Props) => {
  // Define your sidebar endpoints here
  const endpoints = [
    { path: "/dashboard", icon: <DashboardIcon />, label: "Dashboard" },
  ];

  return (
    <div>
      <Topbar />
      {/* <Sidebar endpoints={endpoints} /> */}
      {children}
    </div>
  );
};

export default Layout;
