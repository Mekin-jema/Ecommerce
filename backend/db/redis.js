import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();
// ACCESS_TOKEN_SECRET = access_token_secret;
// REFRESH_TOKEN_SECRET = refresh_token_secret;

export const redis = new Redis(process.env.UPSTASH_REDIT_URL);
// console.log(process.env.REFRESH_TOKEN_SECRET);
// await redis.set("Refresh_tokens", `${process.env.REFRESH_TOKEN_SECRET}`);
