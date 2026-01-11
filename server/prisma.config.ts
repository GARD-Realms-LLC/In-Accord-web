import dotenv from 'dotenv';

dotenv.config();

module.exports = {
  datasource: {
    url: process.env.DATABASE_URL,
  },
};
