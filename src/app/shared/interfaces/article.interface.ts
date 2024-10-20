import { Timestamp } from "@angular/fire/firestore";

export interface Article {
  articleId?: string;

  authorID: number;
  authorName: string;

  available: boolean;
  subscription: boolean;

  category: string;
  content: contentItems[];
  contentPreview?: contentItems[];
  date: Timestamp;
  priority:'high'|'medium'|'low';
  topics:string[];

  frontImage: string;
  frontImageAlt?: string;
  frontImageBanner?: boolean;
  heading: string;
  subheading: string;
}



 export type contentItems = quote | paragraph | htmlParagraph | htmlContent | image | title | subtitle;

 export type quote = {
  quote:string
}
export type paragraph = {
  paragraph:string
}
export type htmlParagraph = {
  htmlParagraph:string
}
export type htmlContent = {
  htmlContent:string
}
export type image = {
  imageAlt:string
  imageUrl:string
}
export type title = {
  title:string
}
export type subtitle = {
  subtitle:string
}