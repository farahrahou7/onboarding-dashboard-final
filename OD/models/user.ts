import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  isVerified: boolean;
}

const UserSchema: Schema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model<IUser>("User", UserSchema);
