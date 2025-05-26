import { DefaultBodyType, HttpResponse, StrictRequest } from "msw";
import actCard from "../MockedData/bravo_data_output.json";
import emptyActCard from "../MockedData/empty_data.json";

export const handleReq = async (
  baseUrl: string,
  paramsUrl: string,
  request: StrictRequest<DefaultBodyType>
) => {
  const url = new URL(request.url);
  if (process.env.NODE_ENV === "development" && url && url.href) {
    console.log(`got ${request.method} request for: ${url.href}`);
  }

  switch (baseUrl) {
    case ``:
      if (url && url.href) {
        console.log(
          "Tenders page server action request",
          request.method,
          url.href
        );
      }

      // 60% chance to return actCard, otherwise emptyActCard
      const random = Math.random();
      console.log("Random number for actCard:", random);
      if (random < 0.6) {
        return HttpResponse.json(actCard);
      } else {
        return HttpResponse.json(emptyActCard);
      }
      break;
    default:
      return HttpResponse.error();
      break;
  }
};
