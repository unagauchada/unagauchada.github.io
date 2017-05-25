import { createAction } from 'redux-actions'
import * as mutations from './mutationsTypes'

export const updateUser = createAction(mutations.UPDATE_USER)

