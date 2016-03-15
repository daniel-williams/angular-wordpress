import * as actions from '../actions/blog.action';
import {BlogState} from '../interfaces';


const initialState: BlogState = {
    isUpdating: false,
    date: null,
    error: null,

    totalPostCount: 0,
    itemsPerPage: 5,
    totalPages: 0,
    activePage: 1,

    posts: [],
};

export default function(state: BlogState = initialState, {type, payload}) {
  switch(type) {
    case actions.FETCHING_EXCERPTS: {
      return Object.assign({}, state, {
        isUpdating: true
      });
    }
    case actions.FETCH_EXCERPTS_SUCCESS: {
      return Object.assign({}, state, {
        isUpdating: false,
        date: payload.date,
        error: null,
        posts: payload.posts,
        totalPostCount: payload.posts.length,
        totalPages: Math.ceil(payload.posts.length / state.itemsPerPage)
      });
    }
    case actions.FETCH_EXCERPTS_FAILED: {
      return Object.assign({}, state, {
        isUpdating: false,
        date: payload.date,
        error: payload.error,
      });
    }
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