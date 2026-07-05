FROM node:22-alpine

WORKDIR /app

RUN corepack enable

ENV CI=true

COPY package.json .
COPY pnpm-lock.yaml .
COPY pnpm-workspace.yaml .

COPY apps ./apps
COPY packages ./packages

RUN pnpm install --frozen-lockfile

RUN pnpm --filter notification-service exec prisma generate

RUN pnpm --filter notification-service build

EXPOSE 3001

CMD ["pnpm", "--filter", "notification-service", "start"]