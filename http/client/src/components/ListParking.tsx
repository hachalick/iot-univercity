"use client";
import React, { useEffect, useState } from "react";
import StatusCar from "./StatusCar";
import { fetchGetSrf } from "@/utils/fetchData";
import { TStatusSrfs } from "@/type/fetch.type";

function ListParking() {
  const [show, setShow] = useState(false);
  const [list, setList] = useState<TStatusSrfs>([]);
  const [filterParking, setFilterParking] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const list = await fetchGetSrf();
      setList(list);
    };
    fetchData();
    setShow((val) => !val);
  }, []);

  const onChangeOptions = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const targetFilter = e.target.value;
    if (targetFilter == "all") {
      setFilterParking(null);
    } else if (targetFilter == "full") {
      setFilterParking(true);
    } else if (targetFilter == "no-full") {
      setFilterParking(false);
    }
  };

  if (show)
    return (
      <div className="flex flex-col gap-1">
        <div className="flex gap-2 items-center justify-between">
          <h2 className="text-lg font-bold">لیست وضعیت پارکینگ ها</h2>
          <select
            id="cars"
            title="filter"
            className="p-1 rounded-lg shadow-xl bg-inherit"
            onChange={(e) => onChangeOptions(e)}
          >
            <option value="all">همه پارکینگ ها</option>
            <option value="full">پارکینگ های پر</option>
            <option value="no-full">پارکینگ های خالی</option>
          </select>
        </div>
        <div className="flex gap-2">
          {list.map((item) => (
            <StatusCar
              key={item.parking_name}
              full={item.full}
              parking={item.parking_name}
              filterParking={filterParking}
            />
          ))}
        </div>
      </div>
    );
}

export default ListParking;
