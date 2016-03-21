

class AppSettings {
  public blog: BlogEndpoints;
  
  constructor() {
    this.blog = new BlogEndpoints();
  }
}


class BlogEndpoints {
  private API_ROOT: string = 'http://blogabit.com/wp-json/wp/v2/';
  
  public getPostsEndpoint(q: string) : string {
    return `${this.API_ROOT}posts${q}`;
  }
  public getPostEndpoint(id: number, q: string): string {
    return `${this.API_ROOT}posts/${id}${q}`;
  }
  
  public getTitlesUrl(): string {
    return this.getPostsEndpoint('?_query=[].{id:id,title:title.rendered,slug:slug,date:date}');
  }
  public getSummaryUrl(id: number): string {
    return this.getPostEndpoint(id, '?_query={id:id,summary:excerpt.rendered}');
  }
  public getBodyUrl(id: number): string {
    return this.getPostEndpoint(id, '?_query={id:id,body:content.rendered}');
  }
  
}

export const appSettings: AppSettings = new AppSettings();