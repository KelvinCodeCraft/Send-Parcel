import request from "supertest";
import express from "express";
import router from './Routers/user.router';
import routerp from "./Routers/parcel.router";
import cron from "node-cron";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/users", router);
app.use("/parcel", routerp);

jest.mock("../background/Email/mail.service", () => jest.fn(async () => "Email sent"));

jest.mock("node-cron", () => ({
  schedule: jest.fn((expression, func) => {
    console.log(`Mock cron job scheduled with expression: ${expression}`);
    func();
  }),
}));

describe("Server Tests", () => {
  test("GET / should return Hello!", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.text).toBe("Hello!");
  });

  test("Cron job should be scheduled", async () => {
    expect(cron.schedule).toHaveBeenCalledWith("*/1 * * * * *", expect.any(Function));
  });
});
