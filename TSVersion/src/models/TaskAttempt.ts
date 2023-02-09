// creating the model for the TaskAttempt table
// imports
import { DataTypes } from 'sequelize';
import sequelize from '../database';
import { TaskAttemptModel } from '../types/TaskAttempt.types';
import Task from './Task';
import Team from './Team';
import Student from './Student';

// model definition
const TaskAttempt = sequelize.define<TaskAttemptModel>('task_attempt', {
    id_task_attempt: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    id_task: {
        type: DataTypes.SMALLINT.UNSIGNED,
        allowNull: false
    },
    id_team: {
        type: DataTypes.INTEGER.UNSIGNED
    },
    id_student: {
        type: DataTypes.INTEGER.UNSIGNED
    },
    task_phase: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    completed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    start_time: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    end_time: {
        type: DataTypes.DATE
    }
}, {
    timestamps: false,
    hooks: {
        beforeCreate: async ({ task_phase, id_team, id_student }: TaskAttemptModel) => {
            if (task_phase !== 'pretask' && task_phase !== 'duringtask' && task_phase !== 'postask') {
                throw new Error('task_phase must be one of the following values: pretask, duringtask, postask');
            }
            if (!id_student && !id_team) {
                throw new Error('Either id_student or id_team must be provided');
            }
        },
    },
});

// definir la relación entre Tareas y Intentos de Tareas
Task.hasMany(TaskAttempt, {
    foreignKey: 'id_task'
});
TaskAttempt.belongsTo(Task, {
    foreignKey: 'id_task'
});

// definir la relación entre Teams y Intentos de Tareas
Team.hasMany(TaskAttempt, {
    foreignKey: 'id_team'
});
TaskAttempt.belongsTo(Team, {
    foreignKey: 'id_team'
});

// definir la relación entre Estudiantes y Intentos de Tareas
Student.hasMany(TaskAttempt, {
    foreignKey: 'id_student'
});
TaskAttempt.belongsTo(Student, {
    foreignKey: 'id_student'
});

export default TaskAttempt;
module.exports = TaskAttempt;