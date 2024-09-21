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



 type contentItems = quote | paragraph | image | title | subtitle;

type quote = {
  quote:string
}
type paragraph = {
  paragraph:string
}
type image = {
  imageAlt:string
  imageUrl:string
}
type title = {
  title:string
}
type subtitle = {
  subtitle:string
}