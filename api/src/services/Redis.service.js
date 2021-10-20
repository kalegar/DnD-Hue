import "core-js/stable";
import "regenerator-runtime/runtime";
import dotenv from 'dotenv';

dotenv.config();

import redis from 'redis';

const url = process.env.REDIS_ADDRESS || 'redis://localhost';

const redisClient = redis.createClient({
    url: url,
    retry_strategy: function(options) {
        if (options.error && options.error.code === "ECONNREFUSED") {
            // End reconnecting on a specific error and flush all commands with
            // a individual error
            return new Error("The server refused the connection");
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
            // End reconnecting after a specific timeout and flush all commands
            // with a individual error
            return new Error("Retry time exhausted");
        }
        if (options.attempt > 10) {
            // End reconnecting with built in error
            return undefined;
        }
        // reconnect after
        return Math.min(options.attempt * 100, 3000);
    }
});

export default redisClient;