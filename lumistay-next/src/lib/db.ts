import sql from "mssql";

const config: sql.config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 1433),
  database: process.env.DB_NAME || "QLKS",
  options: {
    encrypt: process.env.DB_ENCRYPT === "true",
    trustServerCertificate: process.env.DB_TRUST_CERT === "true",
    enableArithAbort: true,
  },
  connectionTimeout: Number(process.env.DB_CONNECTION_TIMEOUT || 15000),
  requestTimeout: Number(process.env.DB_REQUEST_TIMEOUT || 20000),
  pool: {
    max: Number(process.env.DB_POOL_MAX || 3),
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

let pool: sql.ConnectionPool | null = null;

export async function getDb() {
  if (pool?.connected) return pool;
  pool = await sql.connect(config);
  return pool;
}

export { sql };
