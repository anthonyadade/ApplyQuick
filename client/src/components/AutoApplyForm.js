import React, { use, useState } from 'react';
import axios from 'axios';
import useProfile from '../hooks/useProfile';

function AutoApplyForm() {
    const [jobLink, setJobLink] = useState('');
    const {profile, setProfile, error, setError} = useProfile();

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
            <label>
                Job Application Link:
                <input
                    type="text"
                    value={jobLink}
                    onChange={(e) => setJobLink(e.target.value)}
                    required
                />
            </label>
            <button type="submit">Start Auto-Apply</button>
        </form>
    );
}

export default AutoApplyForm;
