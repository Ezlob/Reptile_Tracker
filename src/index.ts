import express from "express";
import { PrismaClient } from '@prisma/client';

const client = new PrismaClient();
const app = express();

app.use(express.json());

type CreateUserBody = {
  firstName: string,
  lastName: string,
  email: string,
  passwordHash: string
}

type CreateReptileBody = {
  name: string,
  sex: string,
}

// create user account
app.post('/users/create', async (req, res) => {
  const {firstName, lastName, email, passwordHash} = req.body as CreateUserBody;
  const user = await client.user.create({ data: {
    firstName,
    lastName,
    email,
    passwordHash,
    createdAt: new Date()
  }});

  res.json({ user });
})

// sign in to user account
// create a reptile
app.post('/user/:userId/reptiles/create', async (req, res) => {
  const {name, sex} = req.body as CreateReptileBody;
  const reptile = await client.reptile.create({ data: {
    userId: parseInt(req.params.userId),
    name,
    sex,
    createdAt: new Date()
  }});

  res.json({ reptile });
})

// delete a reptile
// update a reptile
app.put('/user/:userId/reptiles/:reptileId', async (req, res) => {
  const {name, sex} = req.body as CreateReptileBody;
  const user = await client.reptile.create({ data: {
    userId: parseInt(req.params.userId),
    name,
    sex,
    createdAt: new Date()
  }});

  res.json({ user });
})

// show all reptiles
// create feeding for a reptile
// show all feedings for a reptile
// create husbandry record for a reptile
// show all husbandry records for a reptile
// create a schedule for a reptile
// list all schedules for a reptile
// list all schedules for a user
app.get("/", (req, res) => {
  res.send(`<h1>Hello, world!</h1>`);
});

app.listen(3000, () => {
  console.log("I got started!");
});