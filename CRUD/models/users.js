import {model, Schema} from "mongoose";

export const userSchema = new Schema(
  {
    name: {type: String, required: true},
    email: {type: String, required: true},
    phone: {type: String, required: true},
    image: {type: String, required: true},
    created:{type: Date, required: true, default: Date.now},
  }
);
export const User = model('users', userSchema);

