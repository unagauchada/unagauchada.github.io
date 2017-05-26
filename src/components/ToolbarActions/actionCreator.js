import visitorActions from './visitorActions'
import userActions from './userActions'

const actionCreator = (user) => (
    user === null ? visitorActions : userActions
)

export default actionCreator