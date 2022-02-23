import { createServer, Response } from "miragejs";

export function makeServer() {
  const server = createServer({
    routes() {
      this.namespace = "api";

      this.timing = 750;

      this.get("/twitter", () => {
        // force an error
        return new Response(500);

        // return {
        //   stat: "71,897",
        //   change: "122",
        //   changeType: "increase",
        // };
      });

      this.get(
        "/youtube",
        () => {
          return {
            stat: "33,581",
            change: "412",
            changeType: "decrease",
          };
        },
        { timing: 500 }
      );

      this.get(
        "/chipotle",
        () => {
          return {
            stat: "2,152",
            change: "54",
            changeType: "decrease",
          };
        },
        { timing: 1450 }
      );

      this.get(
        "/instagram",
        () => {
          return {
            stat: "14,153",
            change: "24",
            changeType: "increase",
          };
        },
        { timing: 750 }
      );
    },
  });

  return server;
}
