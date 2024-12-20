import { Schema, model } from "mongoose";
import IActivity from "../interfaces/activity.interface";

const activitySchema = new Schema<IActivity>({
  creatorId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  goalAmount: {
    type: Number,
    required: true,
  },
  totalDonations: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  end_at: {
    type: Date,
    required: true,
  },
});

const Activity = model<IActivity>("Activity", activitySchema);
export default Activity;