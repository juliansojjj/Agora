import { Timestamp } from "@angular/fire/firestore";

export interface Comment {
  commentID?: number;
  uid: number;
  username: string;

  content: string;
  date: Timestamp;
  deletedByUser: boolean;
}
