import { ObjectId } from "mongodb";

export interface Note {
  _id?: ObjectId;
  userId: string;
  text: string;
  createdAt: Date;
}
