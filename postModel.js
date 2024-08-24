import sequelize from "./sequelize.js";
import { Sequelize, DataTypes } from 'sequelize';



const Posts = sequelize.define('post', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    body: DataTypes.STRING(1000),
    postId: DataTypes.INTEGER,
})


sequelize.sync()
    .then(async () => {
        // Insert new row using `create()` method
        console.log('Successfully created the post table!')
    })
    .catch((error) => console.log('Failed to synchronize with the database:', error))

export default Posts;