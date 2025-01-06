import { Schema } from "mongoose";

export default interface IDonation {
  user: Schema.Types.ObjectId;
  activity: Schema.Types.ObjectId;
  amount: number;
}