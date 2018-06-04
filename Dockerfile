FROM node:10.3

WORKDIR /www

ADD . /www

RUN npm install

ENV APP_ID 12117
ENV WEBHOOK_SECRET development
ENV LOG_LEVEL info
ENV WEBHOOK_PROXY_URL https://smee.io/po8AHNfKrX0ZlQd9
ENV HOST http://localhost:3000

EXPOSE 3000

CMD npm start
