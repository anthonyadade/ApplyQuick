import React, { useState } from 'react';
import AutoApplyForm from './components/AutoApplyForm';
import EditProfileForm from './components/EditProfile';

function App() {
    const [showProfile, setShowProfile] = useState(false);

    const handleProfileUpdate = () => {
        alert('Successfully saved');
        setShowProfile(false);
    };

    return (
        <div className="min-vh-100">
            {/* Hero Section */}
            <div
                className="text-white py-4 py-md-5" /* Increased padding on medium and up */
                style={{
                    background: 'linear-gradient(to bottom right, #6610f2, #6f42c1)', /* Indigo to Purple */
                }}
            >
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-6 text-center text-md-start">
                            <h1 className="display-4 fw-bold mb-3">
                                Unlock Your Next Opportunity <span className="text-warning">Faster</span>
                            </h1>
                            <p className="lead opacity-80">
                                Revolutionize your job search and spend less time on applications.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="bg-light py-4">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-8 col-lg-6"> {/* Centered and constrained width on smaller screens */}
                            <div className="bg-white p-4 rounded shadow-sm">
                                {showProfile ? (
                                    <div>
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h3 className="h4 text-indigo m-0">Edit Your Profile</h3>
                                            <button
                                                className="btn btn-outline-secondary btn-sm"
                                                onClick={() => setShowProfile(false)}
                                            >
                                                ← Back
                                            </button>
                                        </div>
                                        <EditProfileForm onSubmitSuccess={handleProfileUpdate} />
                                    </div>
                                ) : (
                                    <div>
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h2 className="h5 text-purple m-0">One-Click Apply</h2>
                                            <button
                                                className="btn btn-indigo btn-sm"
                                                onClick={() => setShowProfile(true)}
                                            >
                                                Edit Profile
                                            </button>
                                        </div>
                                        <AutoApplyForm />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <footer className="text-center text-muted mt-4 py-3">
                        © 2025 Quick Apply. All rights reserved.
                    </footer>
                </div>
            </div>
        </div>
    );
}

export default App;