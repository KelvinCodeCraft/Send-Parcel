import request from "supertest";
import express from "express";
import UserRouter from "./user.router";

const app = express();
app.use(express.json());
app.use("/user", UserRouter);

jest.mock("../Controllers/user.controller", () => ({
  getUserById: jest.fn((req, res) => res.status(200).json({ id: req.params.id, name: "Test User" })),
  getAllUsers: jest.fn((req, res) => res.status(200).json([{ id: 1, name: "User1" }])),
  updateUser: jest.fn((req, res) => res.status(200).json({ message: "User updated" })),
  deleteUser: jest.fn((req, res) => res.status(200).json({ message: "User deleted" })),
  loginUser: jest.fn((req, res) => res.status(200).json({ message: "Login successful", token: "fake-jwt-token" })),
  createUser: jest.fn((req, res) => res.status(201).json({ message: "User created" })),
}));

describe("User Routes", () => {
  test("GET /user should return all users", async () => {
    const response = await request(app).get("/user");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ id: 1, name: "User1" }]);
  });

  test("GET /user/:id should return a user", async () => {
    const response = await request(app).get("/user/1");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: "1", name: "Test User" });
  });

  test("POST /user/login should log in a user", async () => {
    const response = await request(app).post("/user/login").send({ username: "test", password: "password" });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Login successful", token: "fake-jwt-token" });
  });

  test("POST /user/register should create a new user", async () => {
    const response = await request(app).post("/user/register").send({ username: "newuser", password: "password" });
    expect(response.status).toBe(201);
    expect(response.body).toEqual({ message: "User created" });
  });

  test("PUT /user/:id should update a user", async () => {
    const response = await request(app).put("/user/1").send({ name: "Updated User" });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "User updated" });
  });

  test("DELETE /user/:id should delete a user", async () => {
    const response = await request(app).delete("/user/1");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "User deleted" });
  });
});
