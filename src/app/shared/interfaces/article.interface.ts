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

  frontImage: string;
  frontImageAlt?: string;
  frontImageBanner?: boolean;
  heading: string;
  subheading: string;
}



 export type contentItems = quote | paragraph | image | title | subtitle;

 export type quote = {
  quote:string
}
export type paragraph = {
  paragraph:string
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