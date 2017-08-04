import axios from 'axios'
import _ from 'lodash'

const createConfigs = () => {
    const configs = {
        baseURL: 'https://dry-sierra-78195.herokuapp.com',
        crossDomain: true,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded' 
        }
    }
    return configs
}
const api = () => axios.create(createConfigs())

const getResource = (resource, config) => api().get(resource, config)
const postResource = (resource, body, config) => api().post(resource, _.map(body, (value, key)=>key+"="+value).join('&'), config)

export {
    getResource,
    postResource
}
