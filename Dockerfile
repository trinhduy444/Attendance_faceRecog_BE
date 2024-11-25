# Sử dụng Node.js 20 làm base image
FROM node:20-alpine

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Cài đặt các thư viện cần thiết để build các gói liên quan đến SQL Server
RUN apk add --no-cache unixodbc-dev

# Sao chép package.json và package-lock.json để cài đặt các dependencies
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Expose port 5000
EXPOSE 5000

# Khởi động ứng dụng
CMD ["npm", "start"]
