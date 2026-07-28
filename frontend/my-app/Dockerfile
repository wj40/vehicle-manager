FROM node:26 AS base


WORKDIR /home/node/app

# COPY package*.json ./

# RUN npm install

# COPY . .

# EXPOSE 8888

# CMD ["npm", "run", "dev"]

FROM base AS dev

COPY package*.json ./
RUN npm install

EXPOSE 8888
CMD ["npm", "run", "dev"]

FROM base AS builder

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

FROM nginx:stable-alpine AS prod

COPY --from=builder /home/node/app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]