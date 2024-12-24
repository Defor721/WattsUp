"use client";

import { Triangle } from "react-loader-spinner";

export default function Loading() {
  return (
    <Triangle
      visible={true}
      height="80"
      width="80"
      color="#4fa94d"
      ariaLabel="triangle-loading"
      wrapperStyle={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100vw",
      }}
      wrapperClass=""
    />
  );
}
