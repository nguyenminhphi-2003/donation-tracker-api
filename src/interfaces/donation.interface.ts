import { Schema } from "mongoose";

export default interface IDonation {
  userId: Schema.Types.ObjectId;
  activityId: Schema.Types.ObjectId;
  amount: number;
}