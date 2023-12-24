import mongoose from 'mongoose';

const FormSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
    },
    Regarding: {
        type: String,
        required: true,
    },
    Description: {
        type: String,
        required: true,
    },
    contact: {
        type: String,
        required: true,
    },
    solution: {
        type: String,
    },
    isResolved: {
        type: Boolean,
        default: false,
    },

});

const Query = mongoose.model('Query', FormSchema);
export default Query;
