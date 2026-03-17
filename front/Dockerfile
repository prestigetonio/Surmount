FROM node:24-alpine3.21

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

ENV VITE_API_URL=http://localhost:3000

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]