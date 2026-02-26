//--Importing--Code--//

import {Router} from "express";


//--Import--Functions(Controllers)--//

import {ExampleFn} from "../controllers/example.controllers";
import { authenticateToken } from "../middleware/auth.middleware";
import { exampleMiddleware } from "../middleware/example.middleware";

//--Routes--Creation--//

const exampleRoutes = Router();

//--Routes--middleware--(if any)--//

exampleRoutes.use(authenticateToken);

//--Routes--to--Function--connection--//

exampleRoutes.get('/example', ExampleFn);

//--Export--Routes--//

export default exampleRoutes;