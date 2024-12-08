import { Timestamp } from "@angular/fire/firestore";

export interface Article {
  articleID?: string;

  authorID: string;
  authorName: string;

  priority:'high'|'medium'|'low';
  available: boolean;
  subscription: boolean;

  content: contentItems[];
  contentPreview?: contentItems[];
  date: Timestamp;
  source:string;

  category:string;
  urlTopics:string[];
  topics:{name:string,url:string}[];

  frontImage: string;
  frontImageAlt?: string;
  frontImageBanner?: boolean;

  heading: string;
  subheading?: string;
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