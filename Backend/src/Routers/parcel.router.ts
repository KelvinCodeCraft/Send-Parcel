import { Router } from "express";
import {
  addParcel,
  deleteParcel,
  // deliverParcel,
  // getOnTransitParcels,
  getParcel,
  getParcels,
  updateParcel,
} from "../Controllers/parcel.controller";

const routerp = Router();

routerp.post("/add", addParcel);
routerp.delete("/delete/:id",deleteParcel);
routerp.get("/all", getParcels);
routerp.get("/view/:id",getParcel);
routerp.put("/update/:id" ,updateParcel);
// routerp.get("/delivered/:id" ,deliverParcel);
// routerp.get("/ontransit", VerifyToken,getOnTransitParcels);
// routerp.get("/delivered",getDeliveredParcels);

export default routerp;