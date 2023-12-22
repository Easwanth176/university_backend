import mongoose from 'mongoose';

const FormSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
    },
    Number: {
        type: String,
        required: true,
        
    },
    Password: {
        type: String,
    },
    });
const Student = mongoose.model('Student', FormSchema);

export default Student;