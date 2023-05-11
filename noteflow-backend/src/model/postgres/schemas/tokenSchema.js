import {
    number as yupNumber,
    object as yupObject,
    string as yupString,
    ValidationError,
} from 'yup';

const Token = yupObject().shape({
    userId: yupString().required(),
    token: yupString().required(),
});

export default Token;
