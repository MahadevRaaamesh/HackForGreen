import cors from "cors";
import { corsPolicy } from "../config/cors.config";

export const secureCors = cors((req, callback) => {

  const origin = req.headers.origin;

  // Not Allow non-browser requests (Postman, server-to-server)

  if (!origin) {
    return callback(null, { origin: false });
  }

  const rule = corsPolicy[origin as keyof typeof corsPolicy];

  // Explicit deny

  if (!rule) {
    return callback(new Error("CORS blocked"), { origin: false });
  }

  callback(null, {
    origin: true,
    methods: [...rule.methods],         
    allowedHeaders: [...rule.headers],    
    credentials: rule.credentials,
    maxAge: 600
  });
});
