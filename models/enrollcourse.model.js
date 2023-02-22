const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class Enrollcourse extends Model {
        static assocaite(model) { }
    }
    Enrollcourse.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull:false,
            },
            user_id: {
                type: DataTypes.INTEGER,
            },
            course_id: {
                type: DataTypes.INTEGER,
            },
            course_type: {
                type: DataTypes.STRING,
            },
            created_by: {
                type: DataTypes.INTEGER,
            },
            updated_by: {
                type: DataTypes.INTEGER,
            },
            is_deleted: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            deleted_by: {
                type: DataTypes.INTEGER,
            }

        },
        {
            sequelize,
            modelName: 'enroll-course'
        }
    )

    // sequelize.sync({ alter: true }).then(() => {
    //     console.log('enrollcourse table created successfully!');
    // }).catch((error) => {
    //     console.error('Unable to create table : ', error);
    // })

    return Enrollcourse
}