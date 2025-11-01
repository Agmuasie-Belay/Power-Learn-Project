import { Sequelize } from "sequelize";
import dbConfig from './config.js';

const dbConf = dbConfig[process.env.NODE_ENV || 'development'];

export const sequelize = new Sequelize(
    dbConf.database,
    dbConf.username,
    dbConf.password,
    {
        host: dbConf.host,
        dialect: dbConf.dialect,
        logging: false,
    }
);

export default sequelize;
