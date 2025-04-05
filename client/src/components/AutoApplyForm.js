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
            phone: '123-456-7890',
            address: '123 Address Ln',
            education: [{
                school: "Northeastern University",
                degree: "Bachelor's",
                field: "Computer Science",
                gpa: 3.36,
                start: 2020, // year
                end: 2025,
            }],
            skills: ['Python', 'C++'],
            experience: [{
                job_title: "Worka",
                company: "Company",
                Location: "Place, State",
                current: false,
                start: new Date(2025, 3, 23),
                end: new Date(2025, 3, 25),
                description: "Yuh yuh yuh",
            }],
            resume: 'C:/Users/User/Desktop/Planner/Resume/Vmock/kensho/webdevgen/Adade Resume.pdf', // filepath
            linkedIn: 'www.link.com',
            work_authorization: false,
            require_sponsorship: false,
            gender: 'Male',
            hispanic: 'no',
            race: 'African American',
            veteran: 'no',
            disability: "no",
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
