import { combineReducers } from 'redux'
import login from './login'
import user from './user'
import device from './device'

export default combineReducers({
    login,
    user,
    device
})