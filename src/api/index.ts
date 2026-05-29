import { db } from "ponder:api";
import schema from "ponder:schema";
import { graphql } from "ponder";
import { Hono } from "hono";

const app = new Hono();

// 1. Expose the auto-generated GraphQL API
// Mounting on both "/" and "/graphql" is standard practice
app.use("/", graphql({ db, schema }));
app.use("/graphql", graphql({ db, schema }));

// 2. A custom REST endpoint
app.get("/vault-count", async (c) => {
  // Ponder uses Drizzle ORM under the hood for its database client.
  // We query the 'vaults' table you defined in ponder.schema.ts
  const allVaults = await db.select().from(schema.vaults);
  
  return c.json({ 
    success: true,
    totalVaults: allVaults.length 
  });
});

export default app;