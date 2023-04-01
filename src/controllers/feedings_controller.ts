import { PrismaClient } from "@prisma/client";
import { RequestHandler } from "express";
import { RequestWithJWTBody } from "../dto/jwt";
import { controller } from "../lib/controller";

type CreateFeedingBody = {
    foodItem: string
}

const createFeeding = (client: PrismaClient): RequestHandler =>
    async (req: RequestWithJWTBody, res) => {
        const user = req.jwtBody?.userId;
        if (!user) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const reptile = await client.reptile.findFirst({
            where: {
                id: parseInt(req.params.reptileId)
            }
        });

        if (!reptile || !reptile.userId || reptile.userId != user) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const { foodItem } = req.body as CreateFeedingBody;
        const feeding = await client.feeding.create({
            data: {
                reptileId: reptile.id,
                foodItem
            }
        });

        res.json({ feeding });
    }

const showFeedings = (client: PrismaClient): RequestHandler =>
    async (req: RequestWithJWTBody, res) => {
        const user = req.jwtBody?.userId;

        if (!user) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const reptile = await client.reptile.findFirst({
            where: {
                id: parseInt(req.params.reptileId)
            }
        })

        if (!reptile || !reptile.userId || reptile.userId != user) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const feedings = await client.feeding.findMany({
            where: {
              reptileId: reptile.id
            }
          })
      
          res.json({ feedings });
    }

    export const feedingsController = controller(
        "feedings",
        [
          { path: "/:reptileId", endpointBuilder: createFeeding, method: "post" },
          { path: "/:reptileId", endpointBuilder: showFeedings, method: "get" }
        ]
      )