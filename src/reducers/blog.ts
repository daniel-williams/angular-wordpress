import {Action, Reducer} from '@ngrx/store';
import * as actions from '../actions/blog.action';
import {
  IBlogPost,
  IBlogBody,
  IBlogStore,
} from '../interfaces';


const initialState: IBlogStore = {
    isUpdating: false,
    date: null,
    error: null,

    totalPostCount: 0,
    itemsPerPage: 5,
    totalPages: 0,
    activePage: 1,

    posts: [],
};

export const blog: Reducer<IBlogStore> = (state: IBlogStore = initialState, action: Action) => {
  const {type, payload} = action;
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

    case actions.FETCHING_BODY: {
      return Object.assign({}, state, {
        isUpdating: true
      });
    }
    case actions.FETCHED_BODY: {
      return Object.assign({}, state, {
        posts: state.posts.map(post => {
          if(post.id === payload.id) {
            return Object.assign({}, post, {
              isLoaded: true,
              content: payload.content,
            });
          }
          return post;
        })
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