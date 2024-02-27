FROM node:18-alpine

# Path: /app
WORKDIR /app

# Path: /app/package.json
COPY package*.json .

# install dependencies
RUN npm install

#Copy all files
COPY . .

COPY ./src/assets/fonts/poppins-regular.ttf /app/src/assets/fonts/

CMD ["npm", "run", "dev"]