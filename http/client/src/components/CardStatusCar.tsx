"use client";
import { ERoute } from "@/enum/route.enum";
import { TReportStatusSrf } from "@/type/fetch.type";
import { fetchGetReportSrf } from "@/utils/fetchData";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import ChartComponentParking from "./ChartComponentParking";

function CardStatusCar({ parking_name }: { parking_name: string }) {
  const [show, setShow] = useState(false);
  const [full, setFull] = useState(false);
  const [reportStatus, setReportStatus] = useState<TReportStatusSrf>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetchGetReportSrf({ parking_name });
      setReportStatus(res);
      setFull(res[res.length - 1].full);
    };
    fetchData();
    setShow((val) => !val);
  }, []);

  useEffect(() => {
    const Socket = io(ERoute.HOST, {
      transports: ["websocket"],
      withCredentials: true,
    });

    Socket.on(
      parking_name,
      (data: {
        code: number;
        parking_name: string;
        full: boolean;
        date: Date;
      }) => {
        setReportStatus((prev) => [
          ...prev,
          { date: data.date, full: data.full },
        ]);
        setFull(data.full);
      }
    );

    return () => {
      Socket.disconnect();
    };
  }, []);

  if (show && reportStatus.length > 1) {
    return (
      <div className="shadow-2xl bg-[#ffffff00]  rounded-3xl">
        <div className="flex flex-col justify-center items-center rounded-xl p-3">
          <div className="flex">
            {full ? (
              <Image
                src="/no-parking.png"
                alt="no-parking"
                width={120}
                height={120}
                className="p-1"
              />
            ) : (
              <Image
                src="/parking.png"
                alt="parking"
                width={120}
                height={120}
                className=""
              />
            )}
          </div>
          <h1 className="text-lg">{parking_name}</h1>
        </div>
        <div className="rounded-xl p-2">
          <ChartComponentParking data={reportStatus} lastMin={5} />
        </div>
      </div>
    );
  }
}

export default CardStatusCar;
