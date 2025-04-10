const express = require('express');
const Profile = require('../models/profileModel');
const router = express.Router();

/**
 * Creates or Updates the Single Profile
 *
 * If a profile already exists, it updates it. Otherwise, it creates a new one.
 */
router.post('/save', async (req, res) => {
    const profileData = req.body;
    try {
        const existingProfile = await Profile.findOne(); // Find the single profile
        if (existingProfile) {
            // Update the existing profile
            const updatedProfile = await Profile.findByIdAndUpdate(existingProfile._id, profileData, { new: true });
            res.status(200).json(updatedProfile);
        } else {
            // Create a new profile
            const newProfile = await Profile.create(profileData);
            res.status(201).json(newProfile);
        }
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * Gets the Single Profile
 *
 * Retrieves the single profile from the database.
 */
router.get('/', async (req, res) => {
    try {
        const profile = await Profile.findOne(); // Find the single profile
        if (!profile) {
            // Define default values for the profile
            const defaultProfile = {
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                address: '',
                education: [],
                skills: [],
                experience: [],
                resume: '',
                linkedIn: '',
                work_authorization: false,
                require_sponsorship: false,
                gender: '',
                hispanic: '',
                race: '',
                veteran: '',
                disability: '',
            };

            // Create a new profile with default values
            const newProfile = await Profile.create(defaultProfile);
            res.status(201).json(newProfile);
            return;
        }
        res.json(profile);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
module.exports = router;