# Starting from a base image that already has Node.js installed
# node:21 indicates that we are using the latest release of Node.js 21
FROM node:20-alpine
WORKDIR /occ/app/api
COPY package*.json ./
RUN npm install

COPY . .
EXPOSE 4000
CMD ["npm", "run", "dev"]

