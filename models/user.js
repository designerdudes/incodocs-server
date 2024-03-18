import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
    location: String,
    coordinates: {
        type: {
            type: String,
            default: 'Point',
        },
        coordinates: {
            type: [Number],
            default: [0, 0],
        },
    },
    pincode: String,
    addressType: String  
});

// Remove the unique constraint from the index definition
addressSchema.index({ coordinates: '2dsphere', addressType: 1 });  


const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required:true,
    },
    mobileNumber: {
        type: Number,
        sparse: true,
    },
    address: addressSchema,
    password:{
        type: String,
        required:true,
    },
    profileImg: {
        type: String,
        default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
    }, 
    owner: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
    }],
    member: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
    }],
}, {
    timestamps: true,
});

// Create User model
const User = mongoose.model('User', userSchema);

export default User;
