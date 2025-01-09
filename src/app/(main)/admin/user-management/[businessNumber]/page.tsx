"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

import apiClient from "@/lib/axios";

function Page() {
  const { businessNumber } = useParams();
  const [user, setUser] = useState();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await apiClient.get(
          `/api/admin/userinfo/bidlist/${businessNumber}`,
        );
        const data = response.data.userData;
        console.log("data: ", data);
        setUser(data);
      } catch (error) {
        console.error("Error: ", error);
      } finally {
      }
    };

    fetchUserData();
  }, [businessNumber]);

  return <div>{user}</div>;
}

export default Page;
