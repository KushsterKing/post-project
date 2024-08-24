import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize('test_db',
    'root',
    'root@12345', {
        host: 'localhost',
        dialect: 'mysql'
    });

sequelize.authenticate()
    .then(() => console.log('Successfully connected to the database!'))
    .catch((error) => console.log('Failed to connect the database:', error))

export default sequelize