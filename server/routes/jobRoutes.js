const express = require('express');
const Job = require('../models/jobModel');
const autoApply = require('../utils/autoApply');
const router = express.Router();

  /**
   * Creates a Job
   *
   * @param req The object containing the new job's data.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
router.post('/create', async (req, res) => {
    const jobData = req.body;
    try {
        const job = await Job.create(jobData);
        res.status(201).json(job);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

/**
   * Gets a Job
   *
   * @param req The object containing the job's id.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
router.get('/:id', async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        res.json(job);
    } catch (err) {
        res.status(404).json({ error: 'Job not found' });
    }
});

router.post('/auto-apply', async (req, res) => {
    const { jobLink, profileData } = req.body;

    if (!jobLink || !profileData) {
        return res.status(400).json({ error: 'Job link and profile data are required' });
    }

    try {
        // const myRes = await autoApply(jobLink, profileData);
        // if ('error' in myRes) {
        //     throw new Error(myRes.error);
        // }
        await autoApply(jobLink, profileData);
        res.json({ success: true, message: 'Automation started successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to start automation.' });
    }
});


module.exports = router;
