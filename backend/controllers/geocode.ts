import { type Request, type Response } from "express";
import fetchRetry from "fetch-retry";

const fetch = fetchRetry(global.fetch);

export const getGeoCode = async (req: Request, res: Response) => {
  const address = req.query.address;
  if (!address) return res.status(400).json({ error: "No address" });

  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${address}`;
  const response = await fetch(url, {
    headers: {
      "User-Agent": "rented/1.0 (kulesz.jasiek@gmail.com)", // Required by Nominatim
    },
  });
  const data = await response.json();
  res.status(200).json(data);
};
