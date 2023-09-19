const { app } = require("@azure/functions");

app.http("getClientById", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    context.log(`Http function processed request for url "${request.url}"`);

    const name =
      request.query.get("clientId") || (await request.text()) || "world";

    return { body: `Hello, ${name}!` };
  },
});
