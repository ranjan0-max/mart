import axios from 'intercepter/axios';

export async function getItemList(query = {}) {
    try {
        const response = await axios.get('/items', {
            params: {
                ...query
            }
        });
        return response.data.data;
    } catch (error) {
        return error.message;
    }
}

export async function createItem(data) {
    try {
        const response = await axios.post('/items', data);
        return response;
    } catch (error) {
        return error.message;
    }
}

export async function updateItem(idOfitem, data) {
    try {
        const response = await axios.patch(`/items/${idOfitem}`, data);
        return response;
    } catch (error) {
        return error.message;
    }
}
