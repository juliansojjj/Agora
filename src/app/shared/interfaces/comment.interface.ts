import { Timestamp } from "@angular/fire/firestore";

export interface Comment {
  commentId?: string;

  uid: string;
  username: string;

  content: string;
  date: Timestamp;
  deletedByUser: boolean;
}
