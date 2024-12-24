import axios from 'intercepter/axios';

export async function getUser(query = {}) {
    try {
        const response = await axios.get('/users', {
            params: {
                ...query
            }
        });
        return response.data.data;
    } catch (error) {
        return error.message;
    }
}

export async function createUser(data) {
    try {
        const response = await axios.post('/users', data);
        return response;
    } catch (error) {
        return error.message;
    }
}

export async function updateUser(idOfUser, data) {
    try {
        const response = await axios.patch(`/users/${idOfUser}`, data);
        return response;
    } catch (error) {
        return error.message;
    }
}
