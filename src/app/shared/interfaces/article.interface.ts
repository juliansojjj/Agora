export interface Article {
  articleID: number;
  authorID: number;
  available: boolean;
  category: string;
  content: string;
  date: Date;
  frontImage: string;
  heading: string;
  subheading: string;
  subscription: boolean;
}
