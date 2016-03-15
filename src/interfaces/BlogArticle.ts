export interface BlogArticle {
  id: string,
  date: Date,
  title: string,
  slug: string,
  excerpt: string,
  
  isLoaded: boolean,
  content?: string,
}