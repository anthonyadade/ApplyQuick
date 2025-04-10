import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AutoApplyForm from './components/AutoApplyForm';
import EditProfileForm from './components/EditProfile';

function App() {
    //const [profile, setProfile] = useState(null);
    const handleProfileUpdate = () => {
        alert('Successfully saved');
    }

    return (
        <div>
            <h1>Job Application Dashboard</h1>
            <EditProfileForm onSubmitSuccess={handleProfileUpdate}/>
            {/* {profile ? (
                <div>
                    <h2>{profile.name}</h2>
                    <p>{profile.email}</p>
                    <p>Skills: {profile.skills.join(', ')}</p>
                </div>
            ) : (
                <p>Loading profile...</p>
            )} */}
            <br/>
            <AutoApplyForm/>
        </div>
    );
}

export default App;
