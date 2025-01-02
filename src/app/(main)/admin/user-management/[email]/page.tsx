"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

import apiClient from "@/lib/axios";

function Page() {
  const { email } = useParams<{ email: string }>();
  const [user, setUser] = useState();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const decodedEmail = decodeURIComponent(email);
        const response = await apiClient.get(
          `http://localhost:3000//api/admin/userinfo/${decodedEmail}`,
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
  }, []);

  return <div>test</div>;
}

export default Page;
