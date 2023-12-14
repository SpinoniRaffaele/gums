# base node image
FROM node:18 as build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

# Copy local code to the container
COPY . .

# Build production app
RUN npm run build

FROM nginx:latest

# Copy the build output to replace the default nginx contents.
COPY --from=build /usr/src/app/dist/gums-ui /usr/share/nginx/html

# Expose port 80
EXPOSE 80