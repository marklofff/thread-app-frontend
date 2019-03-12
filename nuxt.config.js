const pkg = require('./package')

const environment = process.env.NODE_ENV || 'development'
const envSet = require(`./env.${environment}.js`)
const isDev = (environment != 'development')

console.log(envSet)

module.exports = {
  env: envSet,
  mode: 'universal',

  head: {
    title: 'Discord Thread',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  loading: { color: '#fff' },

  css: [
    { src: '~assets/main.scss', lang: 'scss' },
    "bulma-tooltip/dist/css/bulma-tooltip.min.css",
    "@fortawesome/fontawesome-free/css/all.css",
    "@fortawesome/fontawesome-free/css/fontawesome.css"
  ],

  plugins: [
    '~/plugins/vue-chat-scroll',
    '~/plugins/axios'
  ],

  modules: [
    '@nuxtjs/proxy',
    '@nuxtjs/axios',
    'nuxt-buefy',
    ['nuxt-sass-resources-loader', '~/assets/main.scss'],
    '@nuxtjs/auth',
    '@nuxtjs/pwa'
  ],

  axios: {
    proxy: true
  },

  proxy: {
    '/api': envSet.API_URL,
    '/socket': envSet.WS_URL
  },

  vendor: ['axios', '~/lib/phoenix'],

  workbox: {
    dev: true
  },

  build: {
    extend(config, ctx) {
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },
  render: {
    http2: {
      push: true
    },
    static: {
      maxAge: "1y",
      setHeaders(res, path) {
        if (path.includes("sw.js")) {
          res.setHeader("Cache-Control", `public, max-age=${15 * 60}`)
        }
      }
    }
  },
  router: {
    middleware: ['auth']
  },
  auth: {
    redirect: {
      login: '/',
      logout: '/',
      callback: '/auth/callback',
      home: '/'
    },
    strategies: {
      discord: {
         _scheme: 'oauth2',
        scope: ['identify', 'email'],
        authorization_endpoint: 'https://discordapp.com/api/oauth2/authorize',
        userinfo_endpoint: 'https://discordapp.com/api/v6/users/@me',
        client_id: 'CHANGE ME',
        client_secret: 'CHANGE ME',
        redirect_uri: envSet.REDIRECT_URL,
        response_type: 'token',
        token_type: 'Bearer',
        token_key: 'access_token'
      },
    }
  }
}
