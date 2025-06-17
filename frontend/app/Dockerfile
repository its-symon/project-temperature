# Stage 1: Build React app
FROM node:18 AS build

WORKDIR /app

COPY package*.json ./
COPY public ./public
COPY src ./src

RUN npm install
RUN npm run build

# Stage 2: Serve with `serve`
FROM node:18-alpine

RUN npm install -g serve
WORKDIR /app

COPY --from=build /app/build ./build

EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]
