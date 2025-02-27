import { Request, RequestHandler, Response } from "express";
import db from '../Databasehelper/db-connection';
import { ParcelSchema } from "../helpers/parcel.validate";
import ejs from 'ejs';
import sendMail from "../../background/Helpers/email.helpers";
import path from 'path';

interface ExtendedRequest extends Request {
  body: {
    receiverNumber: string;
    senderNumber: string;
    senderEmail: string;
    receiverEmail: string;
    dispatchedDate: string;
    price: number;
    receiverLat: string;
    receiverLng: string;
    senderLat: string;
    senderLng: string;
    deliveryStatus: string;
  };
  query: {
    senderEmail?: string;
    receiverEmail?: string;
    email?: string;
    role?: string;
    status?: string; // Add status query parameter
  };
}


export const addParcel = async (req: ExtendedRequest, res: Response): Promise<any> => {
  try {
    const { error, value } = ParcelSchema.validate(req.body);
    if (error) {
      console.error("Validation Error:", error.details[0].message);
      return res.status(400).json({ error: error.details[0].message });
    }

    return res.status(200).json({ message: "Parcel data validated successfully" });
    
  } catch (error) {
    console.error("Unexpected Error:", error);
    return res.status(500).json({ message: "Unexpected server error", error });
  }
};


export const getParcels: RequestHandler = async (
  req: ExtendedRequest,
  res: Response
): Promise<any> => {
  try {
    const { senderEmail, receiverEmail, status } = req.query;
    let result;

    if (status && typeof status === "string") {
      const cleanStatus = status.replace(/['"]/g, "");
      result = await db.exec("getParcelsByStatus", { status: cleanStatus });
    } else if (senderEmail && typeof senderEmail === "string") {
      const cleanSenderEmail = senderEmail.replace(/['"]/g, "");
      result = await db.exec("getParcelsByEmail", { email: cleanSenderEmail, role: "sender" });

      // Mark parcels as outgoing
      result = result?.map(parcel => ({ ...parcel, type: "outgoing" }));
    } else if (receiverEmail && typeof receiverEmail === "string") {
      const cleanReceiverEmail = receiverEmail.replace(/['"]/g, "");
      result = await db.exec("getParcelsByEmail", { email: cleanReceiverEmail, role: "receiver" });

      // Mark parcels as incoming
      result = result?.map(parcel => ({ ...parcel, type: "incoming" }));
    } else {
      result = await db.exec("getAllParcels");
    }

    if (!result || result.length === 0) {
      return res.status(404).json({ message: "No parcels found" });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const getParcel: RequestHandler<{ id: string }> = async (req: ExtendedRequest,
  res: Response,
): Promise<any> => {
  try {
    const id = req.params.id;
    const result = await db.exec("getParcelById", { id });
 
    if (!result[0]) {
      return res.status(404).json({ message: "Parcel Not Found" });
    }
 
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


export const getParcelsByEmail: RequestHandler = async (
  req: ExtendedRequest,
  res: Response
): Promise<any> => {
  try {
    const { senderEmail, receiverEmail } = req.query;
    let result;

    if (senderEmail && typeof senderEmail === "string") {
      const cleanSenderEmail = senderEmail.replace(/['"]/g, "");
      result = await db.exec("getParcelsByEmail", { email: cleanSenderEmail, role: 'sender' });
    } else if (receiverEmail && typeof receiverEmail === "string") {
      const cleanReceiverEmail = receiverEmail.replace(/['"]/g, "");
      result = await db.exec("getParcelsByEmail", { email: cleanReceiverEmail, role: 'receiver' });
    } else {
      result = await db.exec("getAllParcels");
    }

    if (!result || result.length === 0) {
      return res.status(404).json({ message: "No parcels found" });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error });
  }
};



export const deleteParcel: RequestHandler<{ id: string }> = async (req, res): Promise<void> => {
  try {
    const id = req.params.id;
    
    // Retrieve the parcel by its id
    const result = await db.exec("getParcelById", { id });
    
    // Check if the parcel exists. Adjust according to your db.exec response structure.
    if (!result || result.length === 0) {
      res.status(404).json({ message: "Parcel Not Found" });
      return;
    }
    
    // If the parcel exists, delete it.
    await db.exec("deleteParcel", { id });
    res.status(200).json({ message: "Parcel Deleted" });
    
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const updateParcel: RequestHandler<{ id: string }> = async (req, res): Promise<any> => {
  try {
    const id = req.params.id;
    
    // Validate the request body
    const { error } = ParcelSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    
    const {
      senderEmail,
      receiverNumber,
      senderNumber,
      receiverEmail,
      dispatchedDate,
      price,
      receiverLat,
      receiverLng,
      senderLat,
      senderLng,
      deliveryStatus,
    } = req.body;

    // Check if the parcel exists by executing the stored procedure "getParcelById"
    const result = await db.exec("getParcelById", { id });
    if (result && result.length > 0) {
      // Parcel exists; perform the update.
      await db.exec("ProjectCreateOrUpdate", {
        id,
        senderEmail,
        receiverNumber,
        senderNumber,
        receiverEmail,
        dispatchedDate,
        price,
        receiverLat,
        receiverLng,
        senderLat,
        senderLng,
        deliveryStatus,
      });

      // Check deliveryStatus data from req.body
      if (deliveryStatus === 'delivered') {
        await fetch("http://localhost:7000/send-sms", {
          method: "POST", 
          headers: {
            "Content-Type": "application/json", 
          },
          body: JSON.stringify({ 
            to: receiverNumber, 
            message: "Your package is now ready for pickup. Please visit Pickup Location with your ID. Thank you for choosing SendIt!" 
          }), 
        });
        // Send email to receiver and sender
        const templatePath = path.join(__dirname, '../../../templates', 'deliveryNotification.ejs');
        const emailData = { receiverNumber, senderNumber,  };

        console.log("Rendering EJS template with data:", emailData);

        ejs.renderFile(templatePath, emailData, async (error, html) => {
          if (error) {
            console.error("Error rendering EJS template:", error);
            return res.status(500).json({ message: "Error rendering email template" });
          }

          console.log("Rendered HTML:", html);

          const messageToSender = {
            from: process.env.EMAIL,
            to: senderEmail,
            subject: "Parcel Delivery Notification",
            html
          };

          const messageToReceiver = {
            from: process.env.EMAIL,
            to: receiverEmail,
            subject: "Parcel Delivery Notification",
            html
          };

          try {
            console.log("Sending email to sender:", senderEmail);
            await sendMail(messageToSender);
            console.log("Email sent to sender:", senderEmail);

            console.log("Sending email to receiver:", receiverEmail);
            await sendMail(messageToReceiver);
            console.log("Email sent to receiver:", receiverEmail);
          } catch (emailError) {
            console.error("Error sending email:", emailError);
            return res.status(500).json({ message: "Error sending email" });
          }
        });
      }

      return res.status(200).json({ message: "Parcel Updated ..." });
    } else {
      // If parcel doesn't exist, send a 404 error.
      return res.status(404).json({ message: "Parcel Not Found" });
    }
  } catch (error) {
    console.error("Error updating parcel:", error);
    return res.status(500).json({ error });
  }
};

export const deliverParcel: RequestHandler<{ id: string }> = async (
  req,
  res
) => {
  try {
    const id = req.params.id;
    const recordset = await db.exec("getParcel", { id });
    if (!recordset[0]) {
      const result = await db.exec("getParcel", { id });
      if (!result[0]) {
        res.status(404).json({ message: "Parcel Not Found!" });
      } else {
        await db.exec("parcelDelivered", { id });
        res.status(200).json({ message: "Parcel Delivered!" });
      }
    }
  } catch (error) {
    res.status(404).json({ error });
  }
}


export const sentParcels: RequestHandler<{ email: string }> = async (
  req,
  res
) => {
  try {
    const email = req.params.email;

    const recordset = await db.exec("getSent", { email });
    res.status(200).json(recordset);
    const result = await db.exec("getSent", { email });
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ error });
  }
};


export const receivedParcels: RequestHandler<{ email: string }> = async (
  req,
  res
) => {
  try {
    const email = req.params.email;

    const recordset = await db.exec("getReceived", { email });
    res.status(200).json(recordset);
    const result = await db.exec("getReceived", { email });
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ error });
  }
};


export const getOnTransitParcels: RequestHandler = async (req, res) => {
  try {
    const recordset = await db.exec("onTransit");
    res.status(200).json(recordset);
    const result = await db.exec("onTransit");
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ error });
  }
};


export const getDeliveredParcels: RequestHandler = async (req, res) => {
  try {
    const recordset = await db.exec("parcelDelivered");
    res.status(200).json(recordset);
    const result = await db.exec("parcelDelivered");
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ error });
  }
}