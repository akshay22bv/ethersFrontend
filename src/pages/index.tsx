import ConvertPage from "@/components/convert/Convert";
import React, { useEffect } from "react";
import { useRouter } from "next/router";

const Home = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/auth/login");
  }, []);
  return <div>Home</div>;
};

export default Home;
