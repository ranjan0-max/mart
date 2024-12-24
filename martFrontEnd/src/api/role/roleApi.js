import axios from 'intercepter/axios';

export async function getRoleById(query = {}) {
    try {
        const response = await axios.get('/roles', {
            params: {
                ...query
            }
        });
        return response.data.data;
    } catch (error) {
        return error.message;
    }
}
