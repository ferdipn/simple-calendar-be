import db from '../config/database.js'
import User from '../models/user.js';
import bcrypt from 'bcryptjs'

const hashedPassword = await bcrypt.hash('password', 10);
const usersData = [
    {
        name: 'John Doe',
        email: 'john@example.com',
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date()
    }
];

const seedUsers = async () => {
    await db.sync();
    try {
        await User.bulkCreate(usersData);
        console.log('Seeder executed successfully');
    } catch (error) {
        console.error('Error executing seeder:', error);
    } finally {
        await db.close();
    }
};

seedUsers();
