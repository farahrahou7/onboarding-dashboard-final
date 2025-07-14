import { ObjectId } from "mongodb";

export interface Participant {
  firstName: string;
  lastName: string;
}

export interface CalendarActivity {
  _id?: ObjectId;
  userId: string;
  date: string;
  title: string;
  equipment?: string[];
  participants?: Participant[];
}
