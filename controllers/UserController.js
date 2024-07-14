import User from '../models/user.js'
import bcrypt from 'bcryptjs'
import { Op } from 'sequelize';
import { validationResult, body } from 'express-validator';


export async function getAllUsers(req, res) {
    try {
        const users = await User.findAll();
        
        res.json({
            data: users,
            error: false,
            status: 200
        })
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
}

export async function getUserById(req, res) {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json({
            data: user,
            error: false,
            status: 200
        });
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
}

export const validateCreateUserInput = [
    body('name')
        .notEmpty().withMessage('name is required')
        .custom(async (value, { req }) => {
            const where = { name: value };
            const user = await User.findOne({ where, paranoid: false });
            if (user) {
                throw new Error('Name must be unique');
            }
            return true;
          }),
    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Email is invalid')
        .custom(async (value, { req }) => {
            const where = { email: value };
            const user = await User.findOne({ where, paranoid: false });
            if (user) {
                throw new Error('Email must be unique');
            }
            return true;
          }),
    body('password')
        .isLength({ min: 6 }).withMessage('Password minimal 6 character'),
];

export const validateUpdateUserInput = [
    body('name')
        .notEmpty().withMessage('name is required')
        .custom(async (value, { req }) => {
            const where = { 
                name: value,
                id: { [Op.ne]: req.params.id }
            };
            const user = await User.findOne({ where, paranoid: false });
            if (user) {
                throw new Error('Name must be unique');
            }
            return true;
          }),
    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Email is invalid')
        .custom(async (value, { req }) => {
            const where = { 
                email: value,
                id: { [Op.ne]: req.params.id }
            }
            const user = await User.findOne({ where, paranoid: false })
            if (user) {
                throw new Error('Email must be unique')
            }
            return true;
          }),
    body('password')
        .isLength({ min: 6 }).withMessage('Password minimal 6 character'),
];
  
export const handleValidationResult = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const formattedErrors = errors.array().map(
        error => ({ [error.path]: error.msg })
    );
  
    return res.status(400).json({ errors: formattedErrors });
};
  

export const createUser = [
    validateCreateUserInput,
    handleValidationResult,
    async function(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password } = req.body;    
        
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await User.create({
                name,
                email,
                password: hashedPassword
            });
        
            res.status(201).json(newUser);
        } catch (error) {
            res.status(400).json({ error: 'Gagal membuat pengguna baru' });
        }
    }
]

export const updateUser = [
    validateUpdateUserInput,
    handleValidationResult,
    async function(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password } = req.body;    
        
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newRequest = {
                name,
                email,
                password: hashedPassword
            }

            const user = await User.findByPk(req.params.id);

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            
            await user.update(newRequest);
        
            res.status(200).json(user);
        } catch (error) {
            res.status(400).json({ error: 'Gagal membuat pengguna baru' });
        }
    }
]

export async function deleteUser(req, res) {
    try {
        const user = await User.findByPk(req.params.id);

        if (!user) return res.status(404).json({ error: 'Pengguna tidak ditemukan' });
        
        await user.destroy();

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Gagal mengambil data pengguna' });
    }
}