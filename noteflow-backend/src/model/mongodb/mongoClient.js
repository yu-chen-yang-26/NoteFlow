import { MongoClient } from 'mongodb';

const {
    MONGO_INITDB_ROOT_USERNAME,
    MONGO_INITDB_ROOT_PASSWORD,
    MONGO_HOST,
    MONGO_PORT,
} = process.env;

console.log(
    'MongoDB init: ' +
        `mongodb://${MONGO_INITDB_ROOT_USERNAME}:${MONGO_INITDB_ROOT_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}`
);

const getMongoClient = () => {
    return new MongoClient(
        `mongodb://${MONGO_INITDB_ROOT_USERNAME}:${MONGO_INITDB_ROOT_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}`,
        { useUnifiedTopology: true }
    );
};

export { getMongoClient };
