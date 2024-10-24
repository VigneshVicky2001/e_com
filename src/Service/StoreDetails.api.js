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

export const updateStoreDetails = (payload) => {
    return baseApi.put('/storeDetails/updateStoreDetails', payload, {
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

export const getLogo = (id) => {
    return baseApi.get(`storeDetails/getLogo/${id}`)
        .then(response => response.data)
        .catch(error => {
            console.error(error);
            throw error;
        });
};

export const getStoreDetailsById = (id) => {
    return baseApi.get(`storeDetails/getStoreDetailsById/${id}`)
        .then(response => response.data)
        .catch(error => {
            console.error(error);
            throw error;
        });
};
