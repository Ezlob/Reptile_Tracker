import { PrismaClient } from "@prisma/client";
import { RequestHandler } from "express";
import { RequestWithJWTBody } from "../dto/jwt";
import { controller } from "../lib/controller";

type CreateHusbandryBody = {
    reptileId: number,
    length: number,
    weight: number,
    temperature: number,
    humidity: number
}

const createHusbandry = (client: PrismaClient): RequestHandler =>
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

        const { length, weight, temperature, humidity } = req.body as CreateHusbandryBody;
        const husbandry = await client.husbandryRecord.create({
            data: {
                reptileId: reptile.id,
                length,
                weight,
                temperature,
                humidity
            }
        });
        res.json({ husbandry });
    }

const showHusbandryRecords = (client: PrismaClient): RequestHandler =>
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

        const husbandryRecords = await client.husbandryRecord.findMany({
            where: {
                reptileId: reptile.id
            }
        })
    }

    export const husbandryController = controller(
        "husbandryRecords",
        [
            {path: "/:reptileId", endpointBuilder: createHusbandry, method: "post"},
            {path: "/:reptileId", endpointBuilder: showHusbandryRecords, method: "get"}
        ]
    )