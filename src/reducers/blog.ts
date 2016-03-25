import {Action, Reducer} from '@ngrx/store';
import * as actions from '../actions/blog.action';
import {IBlogStore} from '../interfaces/IBlogStore';


const initialState: IBlogStore = {
    isUpdating: false,
    date: null,
    error: null,

    totalPostCount: 0,
    itemsPerPage: 5,
    totalPages: 0,
    activePage: 1,

    needSummaries: true,
    postMap: {},
};

export const blog: Reducer<IBlogStore> = (state: IBlogStore = initialState, action: Action) => {
  const {type, payload} = action;
  switch(type) {
    
    case actions.FETCHING_SUMMARIES: {
      return Object.assign({}, state, {
        isUpdating: true
      });
    }
    case actions.FETCHED_SUMMARIES: {
      return Object.assign({}, state, payload, {isUpdating: false, needSummaries: false});
    }
    case actions.FETCHING_BODY: {
      return Object.assign({}, state, {
        postMap: Object.assign({}, state.postMap, {
          [payload.slug]: Object.assign({}, state.postMap[payload.slug], {isUpdating: true}),
        }),
      });
    }
    case actions.FETCHED_BODY: {
      return Object.assign({}, state, {
        postMap: Object.assign({}, state.postMap, {
          [payload.slug]: Object.assign({}, state.postMap[payload.slug], payload.body, {needBody: false, isUpdating: false}),
        }),
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