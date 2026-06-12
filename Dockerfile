FROM node:22-alpine

WORKDIR /app

RUN corepack enable

COPY . .

RUN pnpm install

RUN pnpm --filter notification-service exec prisma generate

RUN pnpm build

CMD ["sh"]