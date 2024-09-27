const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    BASE_URL: "http://localhost:8000/api/v1",
    EMAIL: "test@gmail.com",
    PASSWORD: "Test@123",
    ACCESS_EXPIRATION_TIME: "3600000",
    TIME_BUFFER: "300000",
    RAZORPAY_NAME: "E-COMMERCE",
    ENV: "development",
  },
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  images: {
    domains: ["res.cloudinary.com"],
  },
};

module.exports = nextConfig;
