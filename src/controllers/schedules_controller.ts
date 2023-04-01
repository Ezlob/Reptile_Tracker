import { PrismaClient } from "@prisma/client";
import { RequestHandler } from "express";
import { RequestWithJWTBody } from "../dto/jwt";
import { controller } from "../lib/controller";

type CreateScheduleBody = {
    reptileId: number,
    userId: number,
    type: string,
    description: string,
    monday: boolean,
    tuesday: boolean,
    wednesday: boolean,
    thursday: boolean,
    friday: boolean,
    saturday: boolean,
    sunday: boolean,
}

const createSchedule = (client: PrismaClient): RequestHandler =>
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

        const { type, description, monday, tuesday, wednesday, thursday, friday, saturday, sunday } = req.body as CreateScheduleBody;
        const schedule = await client.schedule.create({
            data: {
                reptileId: reptile.id,
                userId: user,
                type,
                description,
                monday,
                tuesday,
                wednesday,
                thursday,
                friday,
                saturday,
                sunday
            }
        });
        res.json({ schedule });
    }

const showUserSchedules = (client: PrismaClient): RequestHandler =>
    async (req: RequestWithJWTBody, res) => {
        const user = req.jwtBody?.userId;

        if (!user) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const userSchedules = await client.schedule.findMany({
            where: {
                userId: user
            }
        });
        res.json({ userSchedules });
    }

const showReptileSchedules = (client: PrismaClient): RequestHandler =>
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

        const reptileSchedules = await client.schedule.findMany({
            where: {
                reptileId: reptile.id
            }
        });

        res.json({ reptileSchedules })
    }

export const schedulesController = controller(
    "schedules",
    [
        { path: "/:reptileId", endpointBuilder: createSchedule, method: "post" },
        { path: "/", endpointBuilder: showUserSchedules, method: "get" },
        { path: "/:reptileId", endpointBuilder: showReptileSchedules, method: "get" }
    ]
)