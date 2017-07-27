FROM node:alpine
WORKDIR /usr/src/app
COPY package.json /usr/src/app
RUN apk add --update git
RUN npm install

COPY . /usr/src/app
EXPOSE 3000
CMD ["npm","start"]