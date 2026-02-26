export const localhostGetCall = async (token: string | null | undefined) => {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch('http://localhost:3000/api/example', {
        method: 'GET',
        headers: headers,
    });

    if (!response.ok) {
        // You might want to handle specific error codes, e.g., 401 for unauthorized
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
    }

    return response.json();
};