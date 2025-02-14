import request from "supertest";
import express from "express";
import routerp from "./parcel.router";

const app = express();
app.use(express.json());
app.use("/parcel", routerp);

jest.mock("../Controllers/parcel.controller", () => ({
  addParcel: jest.fn((req, res) => res.status(201).json({ message: "Parcel added" })),
  deleteParcel: jest.fn((req, res) => res.status(200).json({ message: "Parcel deleted" })),
  getParcel: jest.fn((req, res) => res.status(200).json({ id: req.params.id, name: "Test Parcel" })),
  getParcels: jest.fn((req, res) => res.status(200).json([{ id: 1, name: "Parcel1" }])),
  updateParcel: jest.fn((req, res) => res.status(200).json({ message: "Parcel updated" })),
}));

describe("Parcel Routes", () => {
  test("POST /parcel/add should add a parcel", async () => {
    const response = await request(app).post("/parcel/add").send({ name: "New Parcel" });
    expect(response.status).toBe(201);
    expect(response.body).toEqual({ message: "Parcel added" });
  });

  test("DELETE /parcel/delete/:id should delete a parcel", async () => {
    const response = await request(app).delete("/parcel/delete/1");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Parcel deleted" });
  });

  test("GET /parcel/all should return all parcels", async () => {
    const response = await request(app).get("/parcel/all");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ id: 1, name: "Parcel1" }]);
  });

  test("GET /parcel/view/:id should return a parcel", async () => {
    const response = await request(app).get("/parcel/view/1");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: "1", name: "Test Parcel" });
  });

  test("PUT /parcel/update/:id should update a parcel", async () => {
    const response = await request(app).put("/parcel/update/1").send({ name: "Updated Parcel" });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Parcel updated" });
  });
});
