
export interface IBlogStore {
    needSummaries: boolean,
    postMap?: any,
    
    totalPostCount: number,
    itemsPerPage: number,
    totalPages: number,
    activePage: number,
    
    isUpdating: boolean,
    date?: Date,
    error?: any,
}


export interface IBlogPost {
  id: number,
  title: string,
  slug: string,
  date: Date,
  
  needSummary: boolean,
  summary?: string,
  
  needBody: boolean,
  body?: string,
  
  isUpdating: boolean,
}


export interface IBlogSummary {
  id: number,
  title: string,
  slug: string,
  date: Date,
  summary: string,
}

export interface IBlogBody {
  id: number,
  body: string,
  needBody: boolean,
}
