declare namespace NodeJS {
  interface ProcessEnv {
    SERVER_URL: string;
    NODE_ENV: string;
    PORT: number;
    DATABASE_URL: string;
    REDIS_HOST: string;
    REDIS_PASSWORD: string;
    REDIS_PORT: number;
  }
}
