const mongoose = require('mongoose');

/**
 * Mongoose schema for our Profile.
 *
 * This schema defines the structure for storing a profile in the database.
 * A profile includes the following fields:
 * - `name`: The name of the user.
 * - `email`: The email address of the user.
 * - `phone`: The phone number of the user.
 * - `address`: The address of the user.
 * - `education`: An array of education records, each containing:
 *   - `school`: The name of the school.
 *   - `degree`: The degree obtained.
 *   - `field`: The field of study.
 *   - `gpa`: The GPA achieved.
 *   - `start`: The start year of the education.
 *   - `end`: The end year of the education.
 * - `skills`: An array of skills.
 * - `experience`: An array of job experiences, each containing:
 *   - `job_title`: The title of the job.
 *   - `company`: The name of the company.
 *   - `Location`: The location of the job.
 *   - `current`: Whether the job is current.
 *   - `start`: The start date of the job.
 *   - `end`: The end date of the job.
 *   - `description`: A description of the job.
 * - `resume`: The file path to the resume.
 * - `work_authorization`: Whether the user has work authorization.
 * - `require_sponsorship`: Whether the user requires sponsorship.
 * - `gender`: The gender of the user.
 * - `race`: The race of the user.
 * - `veteran`: The veteran status of the user, which can be 'yes', 'not protected', or 'no'.
 */
const profileSchema = new mongoose.Schema({
        name: String,
        email: String,
        phone: String,
        address: String,
        education: [{
            school: String,
            degree: String,
            field: String,
            gpa: Number,
            start: Number, // year
            end: Number,
        }],
        skills: [String],
        experience: [{
            job_title: String,
            company: String,
            Location: String,
            current: Boolean,
            start: Date,
            end: Date,
            description: String,
        }],
        resume: String, // filepath
        work_authorization: Boolean,
        require_sponsorship: Boolean,
        gender: String,
        race: String,
        veteran: {enum: ['yes', 'not protected', 'no']}
});

module.exports = mongoose.model('Profile', profileSchema);
