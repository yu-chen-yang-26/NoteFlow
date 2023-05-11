import {
    number as yupNumber,
    object as yupObject,
    string as yupString,
    ValidationError,
} from 'yup';

const userSchema = yupObject().shape({
    name: yupString().required().max(30).default('').trim(),
    email: yupString().required().email().lowercase().trim(),
    password: yupString().when('$validatePassword', {
        is: true,
        then: yupString().required().min(8).max(30),
    }),
});

const validate = (schema) => async (req, res, next) => {
    try {
        await schema.validate({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        return next();
    } catch (err) {
        return res.status(500).json({ type: err.name, message: err.message });
    }
};

export default userSchema;
export { validate };
