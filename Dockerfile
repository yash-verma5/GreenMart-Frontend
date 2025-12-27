# Stage 1: Build
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 3: Serve
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Note: Vite builds to 'dist', standard React builds to 'build'
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]