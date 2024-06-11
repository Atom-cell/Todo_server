FROM node

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install bcrypt

RUN npm install
 
COPY . .
 
CMD ["npm", "start"]
