import baseApi from './baseApi';

export const getAllRestockHistory = () => {
    return baseApi.get('/restockhistory/getAllRestockHistory')
        .then(response => response.data)
        .catch(error => {
            console.error(error);
            throw error;
        });
};

export const addRestockHistory = (payload) => {
    return baseApi.post('/restockhistory/saveRestockHistory', payload)
        .then(response => response.data)
        .catch(error => {
            console.error(error);
            throw error;
        });
};

export const updateRestockHistory = (payload) => {
    return baseApi.post('/restockhistory/updateRestockHistory', payload)
        .then(response => response.data)
        .catch(error => {
            console.error(error);
            throw error;
        });
};

export const getRestockHistoryById = (RHId) => {
    return baseApi.post(`/restockhistory/getRestockHistoryById/${RHId}`)
        .then(response => response.data)
        .catch(error => {
            console.error(error);
            throw error;
        });
};