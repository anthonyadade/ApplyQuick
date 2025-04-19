import React, { useState, useEffect } from 'react';
import useProfile from '../hooks/useProfile';
import Dropdown from './Dropdown';
import StartNEnd from './StartNEnd';
const PROFILE_API_URL = `${process.env.REACT_APP_SERVER_URL}/api/profile`;

function EditProfileForm({ onSubmitSuccess }) {
    const {profile, setProfile, error, setError} = useProfile();
    const [firstLoad, setFirstLoad] = useState(true);

    const convertMongoDateToJSDate = (mongoDate) => {
        const date = new Date(mongoDate);
        return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD for date input fields
    };

    useEffect(() => {
        if (firstLoad && profile) {
            const updatedProfile = {
                ...profile,
                experience: profile.experience.map(exp => ({
                    ...exp,
                    start: exp.start ? convertMongoDateToJSDate(exp.start) : '',
                    end: exp.end ? convertMongoDateToJSDate(exp.end) : '',
                })),
                education: profile.education.map(edu => ({
                    ...edu,
                    start: edu.start ? convertMongoDateToJSDate(edu.start) : '',
                    end: edu.end ? convertMongoDateToJSDate(edu.end) : '',
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
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profile),
            });
            if (!response.ok) throw new Error('Failed to save profile');
            const updatedProfile = await response.json();
            onSubmitSuccess(updatedProfile);
        } catch (err) {
            setError(err.message);
        }
    };

    if (error) return <p>Error: {error}</p>;

    return (
        <>
        {!profile ? <p>Loading...</p> :
            <form onSubmit={handleSubmit} className="mt-4">
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label text-indigo">First Name:</label>
                        <input type="text" name="firstName" value={profile.firstName} onChange={handleChange} className="form-control" />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label text-indigo">Last Name:</label>
                        <input type="text" name="lastName" value={profile.lastName} onChange={handleChange} className="form-control" />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label text-indigo">Email:</label>
                        <input type="email" name="email" value={profile.email} onChange={handleChange} className="form-control" />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label text-indigo">Phone:</label>
                        <input type="text" name="phone" value={profile.phone} onChange={handleChange} className="form-control" />
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label text-indigo">Address:</label>
                    <input type="text" name="address" value={profile.address} onChange={handleChange} className="form-control" />
                </div>

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label text-indigo">Resume:</label>
                        <input type="text" name="resume" value={profile.resume} onChange={handleChange} className="form-control" />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label text-indigo">LinkedIn:</label>
                        <input type="text" name="linkedIn" value={profile.linkedIn} onChange={handleChange} className="form-control" />
                    </div>
                </div>

                <h3 className="mt-4 mb-3 text-purple">Education</h3>
                {profile.education.map((edu, index) => (
                    <div key={index} className="border rounded p-3 mb-3 bg-white shadow-sm">
                        <div className="row">
                            <div className="col-md-6 mb-2">
                                <label className="form-label text-indigo">School:</label> 
                                <input type="text" value={edu.school} onChange={(e) => handleEducationChange(index, 'school', e.target.value)} className="form-control" />
                            </div>
                            <div className="col-md-6 mb-2">
                                <label className="form-label text-indigo">Degree:</label> 
                                <input type="text" value={edu.degree} onChange={(e) => handleEducationChange(index, 'degree', e.target.value)} className="form-control" />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6 mb-2">
                                <label className="form-label text-indigo">Field:</label> 
                                <input type="text" value={edu.field} onChange={(e) => handleEducationChange(index, 'field', e.target.value)} className="form-control" />
                            </div>
                            <div className="col-md-6 mb-2">
                                <label className="form-label text-indigo">GPA:</label> 
                                <input type="number" value={edu.gpa} onChange={(e) => handleEducationChange(index, 'gpa', e.target.value)} className="form-control" />
                            </div>
                        </div>
                        <StartNEnd startValue={edu.start} endValue={edu.end} index={index} onChange={handleEducationChange} labelClass="text-indigo" />
                    </div>
                ))}
                <div className="d-flex gap-2 mb-3">
                    <button type="button" onClick={handleAddEducation} className="btn btn-outline-indigo btn-sm">Add Education</button>
                    <button type="button" onClick={() => handleRemoveLast('education')} className="btn btn-outline-danger btn-sm">Remove Education</button>
                </div>

                <h3 className="mt-4 mb-3 text-purple">Experience</h3>
                {profile.experience.map((exp, index) => (
                    <div key={index} className="border rounded p-3 mb-3 bg-white shadow-sm">
                        <div className="row">
                            <div className="col-md-6 mb-2">
                                <label className="form-label text-indigo">Job Title:</label> 
                                <input type="text" value={exp.job_title} onChange={(e) => handleExperienceChange(index, 'job_title', e.target.value)} className="form-control" />
                            </div>
                            <div className="col-md-6 mb-2">
                                <label className="form-label text-indigo">Company:</label> 
                                <input type="text" value={exp.company} onChange={(e) => handleExperienceChange(index, 'company', e.target.value)} className="form-control" />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6 mb-2">
                                <label className="form-label text-indigo">Location:</label> 
                                <input type="text" value={exp.Location} onChange={(e) => handleExperienceChange(index, 'Location', e.target.value)} className="form-control" />
                            </div>
                            <div className="col-md-6 mb-2">
                                <div className="form-check">
                                    <input type="checkbox" className="form-check-input" checked={exp.current} onChange={(e) => handleExperienceChange(index, 'current', e.target.checked)} />
                                    <label className="form-check-label text-indigo">Current</label> 
                                </div>
                            </div>
                        </div>
                        <StartNEnd startValue={exp.start} endValue={exp.end} index={index} onChange={handleExperienceChange} labelClass="text-indigo" />
                        <div className="mb-2">
                            <label className="form-label text-indigo">Description:</label> 
                            <textarea value={exp.description} onChange={(e) => handleExperienceChange(index, 'description', e.target.value)} className="form-control" rows="3" />
                        </div>
                    </div>
                ))}
                <div className="d-flex gap-2 mb-3">
                    <button type="button" onClick={handleAddExperience} className="btn btn-outline-indigo btn-sm">Add Experience</button>
                    <button type="button" onClick={() => handleRemoveLast('experience')} className="btn btn-outline-danger btn-sm">Remove Experience</button>
                </div>

                <div className="row">
                    <div className="col-md-6 mb-2">
                        <div className="form-check">
                            <input type="checkbox" className="form-check-input" name="work_authorization" checked={profile.work_authorization} onChange={handleChange} />
                            <label className="form-check-label text-indigo">Work Authorization</label> 
                        </div>
                    </div>
                    <div className="col-md-6 mb-3">
                        <div className="form-check">
                            <input type="checkbox" className="form-check-input" name="require_sponsorship" checked={profile.require_sponsorship} onChange={handleChange} />
                            <label className="form-check-label text-indigo">Require Sponsorship</label> 
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <Dropdown label="Gender" name="gender" value={profile.gender} onChange={handleChange} options={['Male', 'Female', 'Prefer Not To Say']} labelClass="text-indigo" />
                    </div>
                    <div className="col-md-6 mb-3">
                        <Dropdown label="Hispanic" name="hispanic" value={profile.hispanic} onChange={handleChange} options={['Yes', 'No', 'Prefer Not To Say']} labelClass="text-indigo" />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <Dropdown label="Race" name="race" value={profile.race} onChange={handleChange} options={['American Indian or Alaskan Native', 'Asian', 'Black or African American', 'White', 'Native Hawaiian or Other Pacific Islander', 'Two or More Races', 'Prefer Not To Say']} labelClass="text-indigo" />
                    </div>
                    <div className="col-md-6 mb-3">
                        <Dropdown label="Veteran" name="veteran" value={profile.veteran} onChange={handleChange} options={['Yes', 'No', 'Prefer Not To Say']} labelClass="text-indigo" />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <Dropdown label="Disability" name="disability" value={profile.disability} onChange={handleChange} options={['Yes', 'No', 'Prefer Not To Say']} labelClass="text-indigo" />
                    </div>
                    <div className="col-md-6 mb-3"></div>
                </div>

                <button type="submit" className="btn btn-indigo w-100 py-2">Save Profile</button>
            </form>
        }
        </>
    );
}

export default EditProfileForm;