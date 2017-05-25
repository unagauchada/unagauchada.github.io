import {combineReducers} from 'redux'
import * as mutations from './mutationsTypes'

const defaultState = {
    user: null
}

const tasks = {
  [mutations.UPDATE_USER] (state, user) {
    return {...state, user }
  },
}

const taskReducer = (state = defaultState, action) => tasks.hasOwnProperty(action.type) ? tasks[action.type](state, action.payload, action) : state

export default taskReducer