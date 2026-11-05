FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN DATABASE_URL="postgresql://expense:local@localhost:5432/expense_track?schema=public" npx prisma generate

EXPOSE 3000

CMD ["npm", "run", "dev"]
