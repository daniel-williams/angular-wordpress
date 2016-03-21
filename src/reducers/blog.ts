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

    needTitles: true,
    postMap: {},
};

export const blog: Reducer<IBlogStore> = (state: IBlogStore = initialState, action: Action) => {
  const {type, payload} = action;
  switch(type) {
    case actions.FETCHING_TITLES:
    case actions.FETCHING_SUMMARY:
    case actions.FETCHING_BODY: {
      return Object.assign({}, state, {
        isUpdating: true
      });
    }

    case actions.FETCHED_TITLES: {
      return Object.assign({}, state, {
        isUpdating: false,
        needTitles: false,
        postMap: payload.postMap,
      });
    }

    case actions.FETCHED_SUMMARY: {
      return Object.assign({}, state, {
        isUpdating: false,
        postMap: Object.assign({}, state.postMap, {
          [payload.slug]: Object.assign({}, state.postMap[payload.slug], payload.summary, {needSummary: false}),
        }),
      });
    }

    case actions.FETCHED_BODY: {
      return Object.assign({}, state, {
        isUpdating: false,
        postMap: Object.assign({}, state.postMap, {
          [payload.slug]: Object.assign({}, state.postMap[payload.slug], payload.body, {needBody: false}),
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