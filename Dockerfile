FROM node:7.9.0

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app

ADD package.json /app/
RUN npm config set registry https://registry.npmjs.org/
RUN npm install
CMD npm start
