FROM node:20-slim

WORKDIR /app

# Copy package files and install only production dependencies with legacy peer deps
COPY package*.json ./
COPY prisma ./prisma
RUN npm install --omit=dev --legacy-peer-deps
RUN ./node_modules/.bin/prisma generate

# Copy pre-compiled JavaScript
COPY dist ./dist
RUN mkdir -p uploads

EXPOSE 5000
ENV PORT=5000

CMD ["node", "--max-old-space-size=450", "dist/server.js"]
