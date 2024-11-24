import { TReportStatusSrf } from "@/type/fetch.type";
import React, { useRef, useEffect } from "react";

const ChartComponentParking = ({
  data,
  lastMin,
}: {
  data: TReportStatusSrf;
  lastMin: number;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const width = canvas.width;
        const height = canvas.height;
        const padding = 50;
        const chartWidth = width - 2 * padding;
        const chartHeight = height - 2 * padding;

        const fiveMinutesAgo = Date.now() - lastMin * 60 * 1000;
        const filteredData = data.filter(
          (item) => new Date(item.date).getTime() >= fiveMinutesAgo
        );

        if (filteredData.length === 0) {
          ctx.fillStyle = "black";
          ctx.font = "16px Arial";
          ctx.fillText("No data in the last 5 minutes", padding, height / 2);
          return;
        }

        const timestamps = filteredData.map((item) =>
          new Date(item.date).getTime()
        );
        const minTime = Math.min(...timestamps);
        const maxTime = Math.max(...timestamps);
        const timeRange = maxTime - minTime;

        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(padding, height - padding);
        ctx.lineTo(width - padding, height - padding);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(padding, height - padding);
        ctx.lineTo(padding, padding);
        ctx.stroke();

        filteredData.forEach((item) => {
          const x =
            padding +
            ((new Date(item.date).getTime() - minTime) / timeRange) *
              chartWidth;
          const y =
            height -
            padding -
            (item.full ? chartHeight * 0.8 : chartHeight * 0.2);

          ctx.fillStyle = item.full ? "green" : "red";
          ctx.beginPath();
          ctx.arc(x, y, 5, 0, 2 * Math.PI);
          ctx.fill();
        });
      }
    }
  }, [data]);

  return <canvas ref={canvasRef} width={700} height={400} />;
};

export default ChartComponentParking;
