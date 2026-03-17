FROM node:24-alpine3.21

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package*.json ./

RUN pnpm install

COPY . .

EXPOSE 3000

CMD ["pnpm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]