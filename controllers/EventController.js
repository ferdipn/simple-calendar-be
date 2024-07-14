import Event from '../models/event.js'
import User from '../models/user.js'
import { Op } from 'sequelize';
import { validationResult, body } from 'express-validator';


export async function getEvents(req, res) {
    try {

        const whereOptions = {};

        if (req.query.search) {
            whereOptions.title = {
                [Op.like]: `%${req.query.search}%`
            };
        }

        if (req.query.assign_to) {
            const assignToIds = Array.isArray(req.query.assign_to) ? req.query.assign_to : [req.query.assign_to];
            whereOptions.assign_to = {
                [Op.in]: assignToIds
            };
        }

        const events = await Event.findAll({
            where: whereOptions,
            include: [{
                model: User,
                as: 'user',
                attributes: ['id', 'name', 'email']
            }]
        });

        res.json({
            data: events,
            error: false,
            status: 200
        });
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
}

export async function getEventById(req, res) {
    try {
        const event = await Event.findByPk(req.params.id);
        if (!event) return res.status(404).json(
            { error: 'event not found' }
        )
        res.json({
            data: event,
            error: false,
            status: 200
        });
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
}

export const validateCreateEventInput = [
    body('title')
        .notEmpty().withMessage('title is required')
        .isLength({ max: 255 }).withMessage('Title maximal 255 character'),
    body('start')
        .notEmpty().withMessage('start is required')
        .custom(value => {
            const isoDateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

            if (!isoDateTimeRegex.test(value)) {
              throw new Error('Start Event must be in YYYY-MM-DDTHH:mm:ss format');
            }
            return true;
        }),
    body('end')
        .notEmpty().withMessage('title is required')
        .custom(value => {
            const isoDateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

            if (!isoDateTimeRegex.test(value)) {
              throw new Error('End Event must be in YYYY-MM-DDTHH:mm:ss format');
            }
            return true;
        }),
];

export const validateUpdateEventInput = [
    body('title')
        .notEmpty().withMessage('title is required')
        .isLength({ max: 255 }).withMessage('Title maximal 255 character'),
    body('start')
        .notEmpty().withMessage('start is required')
        .custom(value => {
            const isoDateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

            if (!isoDateTimeRegex.test(value)) {
              throw new Error('Start Event must be in YYYY-MM-DDTHH:mm:ss format');
            }
            return true;
        }),
    body('end')
        .notEmpty().withMessage('title is required')
        .custom(value => {
            const isoDateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

            if (!isoDateTimeRegex.test(value)) {
              throw new Error('End Event must be in YYYY-MM-DDTHH:mm:ss format');
            }
            return true;
        }),
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
  

export const createEvent = [
    validateCreateEventInput,
    handleValidationResult,
    async function(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, start, end, assign_to } = req.body;    
        
        try {
            const newEvent = await Event.create({
                title,
                start,
                end,
                assign_to
            });

            res.status(201)
                .json({
                    data: newEvent,
                    error: false,
                    status: 200
                });
        } catch (error) {
            res.status(400).json({ error: 'server error' });
        }
    }
]

export const updateEvent = [
    validateUpdateEventInput,
    handleValidationResult,
    async function(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, start, end, assign_to } = req.body;    
        
        try {
            const event = await Event.findByPk(req.params.id);

            if (!event) {
                return res.status(404).json({ error: 'Event not Found' });
            }
            
            await event.update({
                title,
                start,
                end,
                assign_to
            });

            res.status(201)
                .json({
                    data: event,
                    error: false,
                    status: 200
                });
        } catch (error) {
            res.status(400).json({ error: 'server error' });
        }
    }
]

export async function deleteEvent(req, res) {
    try {
        const event = await Event.findByPk(req.params.id);

        if (!event) return res.status(404).json(
            { error: 'Event not Found' })
        ;
        
        await event.destroy();

        res.json({
            'message': 'Success deleted event'
        });
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
}