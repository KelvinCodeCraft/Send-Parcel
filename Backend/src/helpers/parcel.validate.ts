import Joi from "joi";

export const UserSchema = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().required().min(8),
  name: Joi.string().required(),
});
export const SenderSchema = Joi.object({
  email: Joi.string().required().email(),
});
export const LoginSchema = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().required().min(8),
});

export const ParcelSchema = Joi.object({
  senderName: Joi.string().required(),
  receiverName: Joi.string().required(),
  senderEmail: Joi.string().required(),
  receiverEmail: Joi.string().required(),
  dispatchedDate: Joi.string().required(),
  deliveryDate: Joi.string().required(),
  parcelWeight: Joi.number().required(),
  price: Joi.number().required(),
  deliveryStatus: Joi.string().required(),

  receiverLat: Joi.string().required(),
  receiverLng: Joi.string().required(),
  
  senderLat: Joi.string().required(),
  senderLng: Joi.string().required(),
 
});