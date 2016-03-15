import {AppState} from '../interfaces';
import blog from './blog';


const initialState: AppState = {};

export default function(state: AppState = initialState, action) {
  return {
    blog: blog(state.blog, action),
  }
}