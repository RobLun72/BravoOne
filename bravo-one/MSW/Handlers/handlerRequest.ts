import { DefaultBodyType, HttpResponse, StrictRequest } from "msw";
import actCard from "../MockedData/bravo_data_output.json";

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
    case `/tenders`:
      if (url && url.href) {
        console.log(
          "Tenders page server action request",
          request.method,
          url.href
        );
      }
      return HttpResponse.json(actCard);
      break;
    default:
      return HttpResponse.error();
      break;
  }
};
