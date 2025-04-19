import React, { useState } from 'react';
import axios from 'axios';
import useProfile from '../hooks/useProfile';

function AutoApplyForm() {
    const [jobLink, setJobLink] = useState('');
    const { profile, setProfile, error, setError } = useProfile();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/jobs/auto-apply', {
                jobLink,
                profile
            });

            alert(response.data.message);
        } catch (error) {
            alert('Failed to submit application. Please try again.' + error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label className="form-label">
                    Job Application Link:
                </label>
                <input
                    type="text"
                    value={jobLink}
                    onChange={(e) => setJobLink(e.target.value)}
                    required
                    className="form-control"
                />
            </div>
            <div>
                <button type="submit" className="btn btn-yellow w-100 py-2">Apply Now</button>
            </div>
        </form>
    );
}

export default AutoApplyForm;