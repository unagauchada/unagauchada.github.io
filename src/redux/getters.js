import { createSelector } from 'reselect'

export const userSelector = createSelector(
  state => state.user,
  user => user
)
