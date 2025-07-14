import { ObjectId } from "mongodb";

export interface CheckListItem {
  _id?: ObjectId;
  userId: string;
  label: string;
  checked: boolean;
}
