import baseApi from './baseApi';

export const saveStoreDetails = (payload) => {
    return baseApi.post('/storeDetails/saveStoreDetails', payload, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
    .then(response => response.data)
    .catch(error => {
        console.error(error);
        throw error;
    });
};


