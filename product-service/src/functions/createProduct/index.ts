import { handlerPath } from "@libs/handlerResolver";
import schema from "./schema";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      httpApi: {
        method: "post",
        path: "/products",
        request: {
          schemas: {
            "application/json": schema,
          },
        },
      },
    },
  ],
};
