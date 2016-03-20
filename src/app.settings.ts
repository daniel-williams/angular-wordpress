

class AppSettings {
  public blog: BlogEndpoints;
  
  constructor() {
    this.blog = new BlogEndpoints();
  }
}


class BlogEndpoints {
  public API_ROOT: string = 'http://blogabit.com/wp-json/wp/v2/';
  public EXCERPTS: string = this.API_ROOT + 'posts?_query=[].{id:id,date:date,title:title.rendered,slug:slug,excerpt:excerpt.rendered}';
  public getPostBodyEndpoint(id: number): string {
    return `${this.API_ROOT}posts/${id}?_query={id:id,content:content.rendered}`;
  }
}

export const appSettings: AppSettings = new AppSettings();