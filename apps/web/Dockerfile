# # Starting from a base image that already has Node.js installed
# # node:21 indicates that we are using the latest release of Node.js 21
# FROM node:20-alpine
# COPY ./ /occ/app/web
# WORKDIR /occ/app/web
# # COPY package*.json ./

# RUN ["npm", "install"]

# COPY . .
# # COPY ../../tsconfig.base.json ./../../tsconfig.base.json
# # COPY ../../tsconfig.json ./../../tsconfig.json

# EXPOSE 5173
# CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
FROM node:20-alpine

WORKDIR /occ/app/web

# copy only needed files
COPY ./apps/web/package*.json ./
RUN npm install

# copy app source
COPY ./apps/web ./

# may change later (cause now with docker its not a worry)
# this accounts for the shared tsconfig.base,json file in the base directory
# its a pain because its needed to run the frontend 
COPY ./tsconfig.base.json /occ/tsconfig.base.json

EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
