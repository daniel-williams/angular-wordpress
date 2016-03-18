import {Action, Reducer} from '@ngrx/store';
import * as actions from '../actions/blog.action';
import {IBlogState, IBlogArticle} from '../interfaces';


const initialState: IBlogState = {
    isUpdating: false,
    date: null,
    error: null,

    totalPostCount: 0,
    itemsPerPage: 5,
    totalPages: 0,
    activePage: 1,

    posts: [],
};

export const blog: Reducer<IBlogState> = (state: IBlogState = initialState, action: Action) => {
  const {type, payload} = action;
  console.log('spy:', type, payload);
  switch(type) {
    case actions.FETCHING_EXCERPTS: {
      return Object.assign({}, state, {
        isUpdating: true
      });
    }
    case actions.FETCHED_EXCERPTS: {
      return Object.assign({}, state, {
        isUpdating: false,
        date: payload.date,
        error: null,
        posts: payload.posts,
        totalPostCount: payload.posts.length,
        totalPages: Math.ceil(payload.posts.length / state.itemsPerPage)
      });
    }
    // case actions.FETCH_EXCERPTS_FAILED: {
    //   return Object.assign({}, state, {
    //     isUpdating: false,
    //     date: payload.date,
    //     error: payload.error,
    //   });
    // }
    case actions.BLOG_PAGE_NEXT: {
      const totalPages = state.totalPages;
      const activePage = state.activePage;
      return Object.assign({}, state, {
        activePage: activePage < totalPages
          ? activePage + 1
          : activePage,
      });
    }
    case actions.BLOG_PAGE_PREV: {
      const activePage = state.activePage;
      return Object.assign({}, state, {
        activePage: activePage > 1
          ? activePage - 1
          : activePage,
      });
    }
    default: {
      return state;
    }
  }
}