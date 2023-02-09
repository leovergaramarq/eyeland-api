// imports
import { DataTypes } from 'sequelize';
import sequelize from '../database';
import Institution from './Institution';
import Teacher from './Teacher';
import { CourseModel } from '../types/Course.types';

// model definition
const Course = sequelize.define<CourseModel>('course', {
    id_course: {
        type: DataTypes.SMALLINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    id_teacher: {
        type: DataTypes.SMALLINT.UNSIGNED,
        allowNull: false
    },
    id_institution: {
        type: DataTypes.SMALLINT.UNSIGNED,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    description: {
        type: DataTypes.STRING(1000)
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    timestamps: false
});

// definir la relación entre Profesores y Cursos
Teacher.hasMany(Course, {
    foreignKey: 'id_teacher'
});
Course.belongsTo(Teacher, {
    foreignKey: 'id_teacher'
});

// definir la relación entre Instituciones y Cursos
Institution.hasMany(Course, {
    foreignKey: 'id_institution'
});
Course.belongsTo(Institution, {
    foreignKey: 'id_institution'
});

export default Course;
module.exports = Course;