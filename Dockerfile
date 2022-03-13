FROM node:14

RUN mkdir -p /var/www/html/node_modules && chown -R node:node /var/www/html

WORKDIR /var/www/html

COPY package*.json ./

USER node

RUN npm install

COPY --chown=node:node . .

EXPOSE 8080

#CMD npm start
CMD npm dev