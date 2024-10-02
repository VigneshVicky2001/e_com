import baseApi from './baseApi'

export const getBills = (payload) => {
    return baseApi.post('/bill/getAllBills', payload)
        .then(response => response.data)
        .catch(error => {
            console.error(error);
            throw error;
        });
};

export const addBill = (payload) => {
    return baseApi.post('/bill/add', payload)
        .then(response => response.data)
        .catch(error => {
            console.error(error);
            throw error;
        });
};