"use client";
import React, { useEffect } from "react";
import animation from "./utils/animation";

export default function template({ children }: { children: React.ReactNode }) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    animation();
  }, []);
  return (
    <div>
      <div
        id="banner-1"
        className="min-h-screen bg-green-500 z-10 fixed top-0 left-0 w-1/4"
      ></div>
      <div
        id="banner-2"
        className="min-h-screen bg-green-500 z-10 fixed top-0 left-1/4 w-1/4"
      ></div>
      <div
        id="banner-3"
        className="min-h-screen bg-green-500 z-10 fixed top-0 left-2/4 w-1/4"
      ></div>
      <div
        id="banner-4"
        className="min-h-screen bg-green-500 z-10 fixed top-0 left-3/4 w-1/4"
      ></div>
      {children}
    </div>
  );
}
