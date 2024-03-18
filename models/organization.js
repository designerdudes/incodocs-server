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
    pincode: {
        type: String
    },
});

addressSchema.index({ coordinates: '2dsphere' });

const organizationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: String,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    address: {
        type: [addressSchema],  
        sparse: true,
    },shipments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shipment',
    }],
}, {
    timestamps: true,
});

const Organization = mongoose.model('Organization', organizationSchema);

export default Organization;
