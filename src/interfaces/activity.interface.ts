export default interface IActivity {
  creatorId: string;
  name: string;
  description: string;
  goalAmount: number;
  totalDonations: number;
  status: string;
  end_at: Date;
}