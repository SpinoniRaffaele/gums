# base node image
FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --omit=dev

# Copy local code to the container
COPY . .

# Build production appdo
RUN npm run build

EXPOSE 4200

CMD ["npm", "run", "start:container"]