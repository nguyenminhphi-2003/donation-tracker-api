export default interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  comparePassword(
    candidatePassword: string,
    userPassword: string,
  ): Promise<boolean>;
}
