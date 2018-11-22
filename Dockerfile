FROM node:8.11.3

RUN mkdir -p /usr/src/

WORKDIR /usr/src/

COPY package.json /usr/src/
COPY package-lock.json /usr/src/

RUN npm install -g pm2 --silent
RUN npm install --silent --production

COPY . /usr/src/

EXPOSE 8080

CMD ["npm", "start"]