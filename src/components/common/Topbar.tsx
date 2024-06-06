// components/TopBar.js
import React from "react";

const TopBar = () => {
  return (
    <div className="bg-black text-white p-4 fixed w-full top-0 z-10">
      <div className="container mx-auto">
        <h1 className="text-lg font-bold">Header</h1>
      </div>
    </div>
  );
};

export default TopBar;
