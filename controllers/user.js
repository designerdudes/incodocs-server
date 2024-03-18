import User from "../models/user.js";

// Controller function to add a new user
export const addUser = async (req, res) => {
    try {
        const { email } = req.body;
        const existingUser = await User.findOne({ email });  

        if (existingUser) {
            return res.status(409).json(existingUser);  
        }

        const newUser = await User.create(req.body); 
        res.status(201).json(newUser);  
    } catch (error) {
        res.status(400).json({ message: error.message }); 
    }
};


// Controller function to update an existing user
export const updateUser = async (req, res) => {
    const { id } = req.params; 
    const { fullName, email, mobileNumber, address, profileImg } = req.body;  

    try {
        const updatedUser = await User.findByIdAndUpdate(id, { fullName, email, mobileNumber, address, profileImg }, { new: true });  
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });  
        }
        res.status(200).json(updatedUser);  
    } catch (error) {
        res.status(400).json({ message: error.message });  
    }
};


// Controller function to get a user by ID and populate all fields
export const getUserByIdAndPopulateAll = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id)
            .populate({
                path: 'owner',
                model: 'Organization'
            })
            .populate({
                path: 'member',
                model: 'Organization'
            })
            .exec();

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
