const Joi = require('joi');

const CloudEvent = Joi.object({
    specversion: Joi
        .string()
        .required(),
    id: Joi
        .string(),
    type: Joi
        .string()
        .required(),
    source: Joi
        .string(),
    time: Joi.date()
        .required(),
    datacontenttype: Joi
        .string()
        .required(),
    data: Joi.object().required()
});

const Account = Joi.object({
    id: Joi
        .string()
        .required(),
    name: Joi
        .string()
        .required(),
    amount: Joi.number()
        .required()
});

const Operation = Joi.object({
    id: Joi
        .string()
        .required(),
    // name: Joi
    //     .string()
    //     .required(),
    // type: Joi
    //     .string()
    //     .required(),
    // date: Joi
    //     .date()
    //     .required(),
    amount: Joi.number()
        .required()
});

module.exports = { CloudEvent, Account, Operation }