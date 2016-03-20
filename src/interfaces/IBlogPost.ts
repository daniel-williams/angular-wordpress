export interface IBlogPost {
  id: number,
  date: Date,
  title: string,
  slug: string,
  excerpt: string,
  
  isLoaded: boolean,
  content?: string,
}