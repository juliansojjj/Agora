export interface Comment {
  commentID: number;
  userID: number;
  articleID: number;
  username: string;
  content: string;
  datetime: Date;
  userDelete: boolean;
}
