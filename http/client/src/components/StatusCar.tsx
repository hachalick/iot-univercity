"use client";
import { ERoute } from "@/enum/route.enum";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

function StatusCar({
  parking,
  full,
  filterParking,
}: {
  parking: string;
  full: boolean;
  filterParking: boolean | null;
}) {
  const [statusFull, setStatusFull] = useState(full);

  useEffect(() => {
    const Socket = io(ERoute.HOST, {
      transports: ["websocket"],
      withCredentials: true,
    });

    Socket.on(
      parking,
      (data: { code: number; parking: string; full: boolean }) => {
        setStatusFull(data.full);
      }
    );

    return () => {
      Socket.disconnect();
    };
  }, []);

  if (filterParking === statusFull || filterParking === null)
    return (
      <Link
        href={`/parking/?parking_name=${parking}`}
        className="flex flex-col p-1 rounded-md shadow-lg bg-slate-50"
        onClick={() => setStatusFull((val) => !val)}
      >
        <div className="flex">
          {statusFull ? (
            <Image
              src="/no-parking.png"
              alt="no-parking"
              width={60}
              height={60}
              className="p-1"
            />
          ) : (
            <Image
              src="/parking.png"
              alt="parking"
              width={60}
              height={60}
              className=""
            />
          )}
        </div>
        {parking}
      </Link>
    );
}

export default StatusCar;
