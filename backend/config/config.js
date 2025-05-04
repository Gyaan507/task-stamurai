require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME || "neondb_owner",
    password: process.env.DB_PASSWORD || "npg_Gz6TmOvj9Kri",
    database: process.env.DB_NAME     || "neondb",
    host:     process.env.DB_HOST     || "ep-round-hall-a4docz73-pooler.us-east-1.aws.neon.tech",
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  },
  test: {
    username: process.env.DB_USERNAME || "neondb_owner",
    password: process.env.DB_PASSWORD || "npg_Gz6TmOvj9Kri",
    database: process.env.DB_NAME     || "neondb_test",
    host:     process.env.DB_HOST     || "ep-round-hall-a4docz73-pooler.us-east-1.aws.neon.tech",
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host:     process.env.DB_HOST,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};
