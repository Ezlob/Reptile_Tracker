import express, { RequestHandler } from "express";
import { PrismaClient } from "@prisma/client";
import cookieParser from "cookie-parser";
import dotenv, {config} from "dotenv";
import { usersController } from "./controllers/users_controller";
import { reptilesController } from "./controllers/reptiles_controller";
import { feedingsController } from "./controllers/feedings_controller";
import { schedulesController } from "./controllers/schedules_controller";
import { husbandryController } from "./controllers/husbandry_controller";

config({path: ".env"})
dotenv.config();
const client = new PrismaClient();
const app = express();

app.use(express.json());
app.use(cookieParser());

usersController(app, client);
reptilesController(app, client);
feedingsController(app, client);
schedulesController(app, client);
husbandryController(app, client);


app.listen(parseInt(process.env.PORT || "3000", 10), () => {
  console.log(`App running on port ${process.env.PORT}`);
});

export default app;