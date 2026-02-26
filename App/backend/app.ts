//---library import--//

import express from "express";
import {secureCors} from "./middleware/cors.middleware";
import exampleRoutes from "./routes/example.routes";



//--app--creation--//

const app = express();

//--app--middleware--//

app.use(express.json());
app.use(secureCors);


//--app--routes--//

app.use("/api",exampleRoutes);

//--app--listening--//

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running in port ${PORT}`);
})
