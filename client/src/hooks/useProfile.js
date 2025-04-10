import React, { useState, useEffect } from 'react';
const PROFILE_API_URL = `${process.env.REACT_APP_SERVER_URL}/api/profile`;

function useProfile() {
    const [profile, setProfile] = useState(null); // Initially null to indicate loading
    const [error, setError] = useState(null);

    // Fetch profile data from the backend
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(`${PROFILE_API_URL}/`);
                if (!response.ok) {
                    // Attempt to parse the error message from the response body
                    let errorMessage = 'Failed to fetch profile';
                    try {
                        const errorData = await response.json();
                        errorMessage = errorData.error || errorMessage;
                    } catch (jsonError) {
                        // If response is not JSON, fallback to generic error
                        errorMessage = `HTTP Error: ${response.status}`;
                    }
                    throw new Error(errorMessage);
                }
                const data = await response.json();
                setProfile(data);
            } catch (err) {
                setError(err.message);
            }
        }
        fetchProfile();
    }, []);
    return {profile, setProfile, error, setError};
}

export default useProfile;