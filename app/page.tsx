"use client";

import UrlShortener from "@/components/UrlShortener";
import { UserProvider } from "@/components/UserProvider";
import { useEffect, useState } from "react";
import AdsContainer from "@/components/AdsContainer";

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="flex flex-col items-center">
      {isClient ? <UrlShortener /> : null}
      <AdsContainer />
    </div>
  );
}
