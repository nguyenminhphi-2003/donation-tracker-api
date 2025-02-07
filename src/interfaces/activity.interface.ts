import { Schema } from "mongoose";

export default interface IActivity {
  readonly creator: Schema.Types.ObjectId;
  name: string;
  description: string;
  goalAmount: number;
  totalDonations: number;
  status: string;
  end_at: Date;
}