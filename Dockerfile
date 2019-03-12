FROM node:lts-alpine

RUN apk add curl
RUN curl --compressed -o- -L https://yarnpkg.com/install.sh | sh
ENV PATH $(yarn global bin):$PATH

WORKDIR /opt/app
COPY . /opt/app

RUN cd /opt/app && \
    yarn install && \
    yarn build

ENV HOST 0.0.0.0
EXPOSE 8888

CMD ["yarn", "start"]
