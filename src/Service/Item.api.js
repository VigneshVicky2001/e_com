import baseApi from './baseApi';

export const getItems = (payload) => {
    return baseApi.post('/item/filter', payload)
        .then(response => response.data)
        .catch(error => {
            console.error(error);
            throw error;
        })
}

export const addItem = (payload) => {
    return baseApi.post('/item/add', payload)
        .then(response => response.data)
        .catch(error => {
            console.error(error);
            throw error;
        })
}

export const getItemById = (itemId) => {
    return baseApi.get(`/item/getItemById/${itemId}`)
        .then(response => response.data)
        .catch(error => {
            console.error(error);
            throw error;
        })
}

export const updateItem = (payload) => {
    return baseApi.post('/item/update', payload)
        .then(response => response.data)
        .catch(error => {
            console.error(error);
            throw error;
        })
}

export const getAllItemAndName = () => {
    return baseApi.get('/item/getAllItemIdAndName')
        .then(response => response.data)
        .catch(error => {
            console.error(error);
            throw error;
        });
};

export const getAllItems = () => {
    return baseApi.get('/item/get')
        .then(response => response.data)
        .catch(error => {
            console.error(error);
            throw error;
        });
};