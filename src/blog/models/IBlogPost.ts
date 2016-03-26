export interface IBlogPost {
  id: number,
  title: string,
  slug: string,
  date: Date,
  summary?: string,
  body?: string,
  
  isUpdating: boolean,
  needSummary: boolean,
  needBody: boolean,
}