const mongoose = require('mongoose');

/**
 * Mongoose schema for the Job collection.
 *
 * This schema defines the structure for storing job applications in the database.
 * Each job includes the following fields:
 * - `title`: The title of the job.
 * - `company`: The name of the company.
 * - `jobLocation`: The location of the job.
 * - `link`: The link to the job posting.
 * - `status`: The current status of the job application, which can be 'Saved', 'Applied', 'Interview', 'Offer', or 'Rejected'.
 * - `appliedDate`: The date when the job application was submitted.
 */
const jobSchema = new mongoose.Schema({
    title: String,
    company: String,
    jobLocation: String,
    link: String,
    status: { type: String, enum: ['Saved', 'Applied', 'Interview', 'Offer', 'Rejected'] },
    appliedDate: Date
});

module.exports = mongoose.model('Job', jobSchema);