import { EMethodRequest } from "@/enum/method-req.enum";
import { ERoute } from "@/enum/route.enum";
import { TReportStatusSrf, TStatusSrfs } from "@/type/fetch.type";

export async function fetchGetSrf(): Promise<TStatusSrfs> {
  const res = await fetch(ERoute.HOST + ERoute.GET_SENSOR, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    cache: "no-store",
    method: EMethodRequest.GET,
  });
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
}

export async function fetchGetReportSrf({
  parking_name,
}: {
  parking_name: string;
}): Promise<TReportStatusSrf> {
  const query = `{parking_name}?parking_name=${parking_name}`;
  const res = await fetch(ERoute.HOST + ERoute.GET_SENSOR + query, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    cache: "no-store",
    method: EMethodRequest.GET,
  });
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
}
