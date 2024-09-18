export interface Comment {
  commentID?: number;
  userID: number;
  username: string;
  content: string;
  date: Date;
  userDelete: boolean;
}
