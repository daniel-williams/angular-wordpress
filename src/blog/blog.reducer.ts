import {Action, Reducer} from '@ngrx/store';

import {IBlogStore} from './models';
import * as actions from './blog.actions';


const initialState: IBlogStore = {
    isUpdating: false,
    date: null,
    error: null,

    postCount: 0,
    postsPerPage: 5,
    pageCount: 0,
    currentPage: 1,

    needSummaries: true,
    needTags: true,
    postMap: {},
    tags: [],
};

export const BlogReducer: Reducer<IBlogStore> = (state: IBlogStore = initialState, action: Action) => {
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
    case actions.FETCHING_TAGS: {
      return Object.assign({}, state, {
        isUpdating: true
      });
    }
    case actions.FETCHED_TAGS: {
      return Object.assign({}, state, payload, {isUpdating: false, needTags: false});
    }

    case actions.BLOG_PAGE_NEXT: {
      const pageCount = state.pageCount;
      const currentPage = state.currentPage;
      return Object.assign({}, state, {
        currentPage: currentPage < pageCount
          ? currentPage + 1
          : currentPage,
      });
    }
    case actions.BLOG_PAGE_PREV: {
      const currentPage = state.currentPage;
      return Object.assign({}, state, {
        currentPage: currentPage > 1
          ? currentPage - 1
          : currentPage,
      });
    }
    default: {
      return state;
    }
  }
}