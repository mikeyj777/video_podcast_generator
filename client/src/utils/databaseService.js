// src/utils/databaseService.js
const API_BASE_URL = process.env.REACT_APP_API_URL

export const createSession = async (entryPath, email = null) => {
    try {
        const response = await fetch(`${API_BASE_URL}/sessions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ entryPath, email }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating session:', error);
        throw error;
    }
};

export const addSourceToSession = async (sessionId, content, type) => {
    try {
        const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}/sources`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content,
                type: type // 'url' or 'text'
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error adding source:', error);
        throw error;
    }
};

export const updateSessionStatus = async (sessionId, status) => {
    try {
        const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating session status:', error);
        throw error;
    }
};