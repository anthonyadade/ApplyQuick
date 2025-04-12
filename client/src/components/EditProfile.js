import React, { useState, useEffect } from 'react';
import useProfile from '../hooks/useProfile';
import Dropdown from './Dropdown';
const PROFILE_API_URL = `${process.env.REACT_APP_SERVER_URL}/api/profile`;

function EditProfileForm({ onSubmitSuccess }) {
    // const [profile, setProfile] = useState(null); // Initially null to indicate loading
    // const [loading, setLoading] = useState(true);
    // const [error, setError] = useState(null);
    const {profile, setProfile, error, setError} = useProfile();
    const [firstLoad, setFirstLoad] = useState(true);
    // Fetch profile data from the backend
    // useEffect(() => {
    // });

    const convertMongoDateToJSDate = (mongoDate) => {
        const date = new Date(mongoDate);
        return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD for date input fields
    };

    // Example usage: Convert date fields in profile data
    useEffect(() => {
        if (firstLoad && profile) {
            const updatedProfile = {
                ...profile,
                experience: profile.experience.map(exp => ({
                    ...exp,
                    start: exp.start ? convertMongoDateToJSDate(exp.start) : '',
                    end: exp.end ? convertMongoDateToJSDate(exp.end) : '',
                })),
            };
            setProfile(updatedProfile);
            setFirstLoad(false);
        }
    }, [profile]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProfile({...profile, [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleEducationChange = (index, field, value) => {
        const updatedEducation = [...profile.education];
        updatedEducation[index][field] = value;
        setProfile({ ...profile, education: updatedEducation });
    };

    const handleExperienceChange = (index, field, value) => {
        const updatedExperience = [...profile.experience];
        updatedExperience[index][field] = value;
        setProfile({ ...profile, experience: updatedExperience });
    };

    const handleAddEducation = () => {
        setProfile({
            ...profile,
            education: [...profile.education, { school: '', degree: '', field: '', gpa: '', start: '', end: '' }],
        });
    };

    const handleAddExperience = () => {
        setProfile({
            ...profile,
            experience: [...profile.experience, { job_title: '', company: '', Location: '', current: false, start: '', end: '', description: '' }],
        });
    };

    const handleRemoveLast = (type) => {
        setProfile({
            ...profile,
            [type]: profile[type].slice(0, -1),
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${PROFILE_API_URL}/save`, {
                method: 'POST', // Use POST instead of PUT
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profile),
            });
            if (!response.ok) throw new Error('Failed to save profile');
            const updatedProfile = await response.json();
            onSubmitSuccess(updatedProfile); // Notify parent component of success
        } catch (err) {
            setError(err.message);
        }
    };
    
    if (error) return <p>Error: {error}</p>;

    return (
        <>
        {!profile ? <p>Loading...</p> :
            <form onSubmit={handleSubmit}>
            <h2>Edit Profile</h2>
            <label>
                First Name:
                <input type="text" name="firstName" value={profile.firstName} onChange={handleChange} />
            </label>
            <label>
                Last Name:
                <input type="text" name="lastName" value={profile.lastName} onChange={handleChange} />
            </label>
            <label>
                Email:
                <input type="email" name="email" value={profile.email} onChange={handleChange} />
            </label>
            <label>
                Phone:
                <input type="text" name="phone" value={profile.phone} onChange={handleChange} />
            </label>
            <label>
                Address:
                <input type="text" name="address" value={profile.address} onChange={handleChange} />
            </label>

            <h3>Education</h3>
            {profile.education.map((edu, index) => (
                <div key={index}>
                    <label>
                        School:
                        <input
                            type="text"
                            value={edu.school}
                            onChange={(e) => handleEducationChange(index, 'school', e.target.value)}
                        />
                    </label>
                    <label>
                        Degree:
                        <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                        />
                    </label>
                    <label>
                        Field:
                        <input
                            type="text"
                            value={edu.field}
                            onChange={(e) => handleEducationChange(index, 'field', e.target.value)}
                        />
                    </label>
                    <label>
                        GPA:
                        <input
                            type="number"
                            value={edu.gpa}
                            onChange={(e) => handleEducationChange(index, 'gpa', e.target.value)}
                        />
                    </label>
                    <label>
                        Start Year:
                        <input
                            type="number"
                            value={edu.start}
                            onChange={(e) => handleEducationChange(index, 'start', e.target.value)}
                        />
                    </label>
                    <label>
                        End Year:
                        <input
                            type="number"
                            value={edu.end}
                            onChange={(e) => handleEducationChange(index, 'end', e.target.value)}
                        />
                    </label>
                </div>
            ))}
            <button type="button" onClick={handleAddEducation}>Add Education</button>
            <button type="button" onClick={() => handleRemoveLast('education')}>Remove Education</button>
            <h3>Experience</h3>
            {profile.experience.map((exp, index) => (
                <div key={index}>
                    <label>
                        Job Title:
                        <input
                            type="text"
                            value={exp.job_title}
                            onChange={(e) => handleExperienceChange(index, 'job_title', e.target.value)}
                        />
                    </label>
                    <label>
                        Company:
                        <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                        />
                    </label>
                    <label>
                        Location:
                        <input
                            type="text"
                            value={exp.Location}
                            onChange={(e) => handleExperienceChange(index, 'Location', e.target.value)}
                        />
                    </label>
                    <label>
                        Current:
                        <input
                            type="checkbox"
                            checked={exp.current}
                            onChange={(e) => handleExperienceChange(index, 'current', e.target.checked)}
                        />
                    </label>
                    <label>
                        Start Date:
                        <input
                            type="date"
                            value={exp.start}
                            onChange={(e) => handleExperienceChange(index, 'start', e.target.value)}
                        />
                    </label>
                    <label>
                        End Date:
                        <input
                            type="date"
                            value={exp.end}
                            onChange={(e) => handleExperienceChange(index, 'end', e.target.value)}
                        />
                    </label>
                    <label>
                        Description:
                        <textarea
                            value={exp.description}
                            onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                        />
                    </label>
                </div>
            ))}
            <button type="button" onClick={handleAddExperience}>Add Experience</button>
            <button type="button" onClick={() => handleRemoveLast('experience')}>Remove Experience</button>
            <h3>Other Details</h3>
            <label>
                Resume Filepath:
                <input type="text" name="resume" value={profile.resume} onChange={handleChange} />
            </label>
            <label>
                LinkedIn:
                <input type="text" name="linkedIn" value={profile.linkedIn} onChange={handleChange} />
            </label>
            <label>
                Work Authorization:
                <input
                    type="checkbox"
                    name="work_authorization"
                    checked={profile.work_authorization}
                    onChange={handleChange}
                />
            </label>
            <label>
                Require Sponsorship:
                <input
                    type="checkbox"
                    name="require_sponsorship"
                    checked={profile.require_sponsorship}
                    onChange={handleChange}
                />
            </label>
            {/* <label>
                Gender:
                <input type="text" name="gender" value={profile.gender} onChange={handleChange} />
            </label> */}
            <Dropdown label={'Gender'} name={'gender'} options={['Male', 'Female', 'Prefer Not To Say']}  value={profile.gender} onChange={handleChange}/>
            <Dropdown label={'Hispanic'} name={'hispanic'} options={['Yes', 'No', 'Prefer Not To Say']}  value={profile.hispanic} onChange={handleChange}/>
            <Dropdown label={'Race'} name={'race'} options={['American Indian or Alaskan Native', 'Asian', 'Black or African American', 'White',
                'Native Hawaiian or Other Pacific Islander', 'Two or More Races', 'Prefer Not To Say']}  value={profile.race} onChange={handleChange}/>
            <Dropdown label={'Veteran'} name={'veteran'} options={['Yes', 'No', 'Prefer Not To Say']}  value={profile.veteran} onChange={handleChange}/>
            <Dropdown label={'Disability'} name={'disability'} options={['Yes', 'No', 'Prefer Not To Say']}  value={profile.disability} onChange={handleChange}/>
            {/* <label>
                Hispanic:
                <input type="text" name="hispanic" value={profile.hispanic} onChange={handleChange} />
            </label>
            <label>
                Race:
                <input type="text" name="race" value={profile.race} onChange={handleChange} />
            </label>
            <label>
                Veteran:
                <input type="text" name="veteran" value={profile.veteran} onChange={handleChange} />
            </label>
            <label>
                Disability:
                <input type="text" name="disability" value={profile.disability} onChange={handleChange} />
            </label> */}

            <button type="submit">Save Profile</button>
        </form>
        }
        </>
    );
}

export default EditProfileForm;