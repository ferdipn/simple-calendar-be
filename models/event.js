import { DataTypes } from 'sequelize';
import db from '../config/database.js';
import User from './user.js'

const Event = db.define('Event', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    start: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    end: {
        type: DataTypes.DATE,
        allowNull: false
    },
    assign_to: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    }
}, {
    tableName: 'events',
    paranoid: true,
    timestamps: true
});

Event.belongsTo(User, { foreignKey: 'assign_to', as: 'user' });

export default Event;