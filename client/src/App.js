import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:3000/api/profiles/65a123456789')
            .then((response) => setProfile(response.data))
            .catch((error) => console.error('Error fetching profile:', error));
    }, []);

    return (
        <div>
            <h1>Job Application Dashboard</h1>
            {profile ? (
                <div>
                    <h2>{profile.name}</h2>
                    <p>{profile.email}</p>
                    <p>Skills: {profile.skills.join(', ')}</p>
                </div>
            ) : (
                <p>Loading profile...</p>
            )}
        </div>
    );
}

export default App;
