//change the Cors Policy as needed//

export const corsPolicy = {
  "http://localhost:5173": {
    methods: ["GET", "POST", "PUT", "DELETE"], // Added PUT, DELETE for broader API usage
    headers: ["Content-Type", "Authorization"], // Added Authorization header
    credentials: true
  },
  "https://example.myapp.com": {
    methods: ["GET", "POST", "PUT", "DELETE"],
    headers: ["Content-Type", "Authorization"],
    credentials: true
  }
} as const