

class AppSettings {
  public blog: BlogEndpoints;
  
  constructor() {
    this.blog = new BlogEndpoints();
  }
}


class BlogEndpoints {
  private API_ROOT: string = 'http://blog.skyberrystudio.com/api/';
  
  public getPostsEndpoint(q: string) : string {
    return `${this.API_ROOT}get_posts/?${q}`;
  }
  public getPostEndpoint(id: number, q: string): string {
    return `${this.API_ROOT}get_post/?post_id=${id}&${q}`;
  }
  
  public getSummariesUrl(): string {
    return this.getPostsEndpoint('include=id,title,slug,date,excerpt&count=500');
  }
  public getBodyUrl(id: number): string {
    return this.getPostEndpoint(id, 'include=content');
  }
  
}

export const appSettings: AppSettings = new AppSettings();