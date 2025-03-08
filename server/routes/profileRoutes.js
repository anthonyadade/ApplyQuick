const express = require('express');
const Profile = require('../models/profileModel');
const router = express.Router();

  /**
   * Creates a Profile
   *
   * @param req The object containing the new profile's data.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
router.post('/create', async (req, res) => {
    const profileData = req.body;
    try {
        const profile = await Profile.create(profileData);
        res.status(201).json(profile);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

/**
   * Gets a Profile
   *
   * @param req The object containing the profile's id.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
router.get('/:id', async (req, res) => {
    try {
        const profile = await Profile.findById(req.params.id);
        res.json(profile);
    } catch (err) {
        res.status(404).json({ error: 'Profile not found' });
    }
});

module.exports = router;
