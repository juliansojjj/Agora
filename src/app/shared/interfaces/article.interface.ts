export interface Article {
  id: string;

  authorID: number;
  authorName: string;

  available: boolean;
  subscription: boolean;

  category: string;
  content: contentItems[];
  date: Date;

  frontImage: string;
  frontImageAlt?: string;
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