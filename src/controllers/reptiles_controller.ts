import { PrismaClient } from "@prisma/client";
import { RequestHandler } from "express";
import { RequestWithJWTBody } from "../dto/jwt";
import { controller } from "../lib/controller";

type CreateReptileBody = {
  name: string,
  species: string,
  sex: string,
}

const createReptile = (client: PrismaClient): RequestHandler =>
  async (req: RequestWithJWTBody, res) => {
    const user = req.jwtBody?.userId;

    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { name, species, sex } = req.body as CreateReptileBody;
    const reptile = await client.reptile.create({
      data: {
        userId: user,
        name,
        species,
        sex
      }
    });

    res.json({ reptile });
  }


const showReptiles = (client: PrismaClient): RequestHandler =>
  async (req: RequestWithJWTBody, res) => {
    const user = req.jwtBody?.userId;

    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const reptiles = await client.reptile.findMany({
      where: {
        userId: user
      }
    })

    res.json({ reptiles });
  }

const updateReptile = (client: PrismaClient): RequestHandler =>
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

    const { name, species, sex } = req.body as CreateReptileBody;
    const updated = await client.reptile.update({
      where: {
        id: parseInt(req.params.reptileId)
      },
      data: {
        name,
        species,
        sex
      }
    }
    );

    res.json({ updated });
  }

const deleteReptile = (client: PrismaClient): RequestHandler =>
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

    await client.reptile.delete({
      where: {
        id: parseInt(req.params.reptileId)
      }
    })
    res.json({ message: "deleted" });
  }

export const reptilesController = controller(
  "reptiles",
  [
    { path: "/", endpointBuilder: createReptile, method: "post" },
    { path: "/", endpointBuilder: showReptiles, method: "get" },
    { path: "/:reptileId", endpointBuilder: updateReptile, method: "put" },
    { path: "/:reptileId", endpointBuilder: deleteReptile, method: "delete" }
  ]
)