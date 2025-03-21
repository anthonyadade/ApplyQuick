import React, { useState } from 'react';
import axios from 'axios';

function AutoApplyForm() {
    const [jobLink, setJobLink] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const profileData = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            deviceType: 'Mobile',
            phone: '123-456-7890'
        };

        try {
            const response = await axios.post('http://localhost:8000/api/jobs/auto-apply', {
                jobLink,
                profileData
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
