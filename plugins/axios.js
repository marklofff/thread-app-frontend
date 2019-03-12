import api from '~/lib/api'

export default ({ store, app: { $axios } }) => {
  $axios.interceptors.request.use(request => {
    if (store.state.token) {
      let token = store.state.token
      request.headers.common['Authorization'] = 'Bearer ' + token
    }
    return request
  })

}
