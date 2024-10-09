import baseApi from './baseApi';

export const getAllDistributors = () => {
    return baseApi.get('/distributor/getAllDistributor')
        .then(response => response.data)
        .catch(error => {
            console.error(error);
            throw error;
        });
};

export const addDistributor = (payload) => {
    return baseApi.post('/distributor/saveDistributor', payload)
        .then(response => response.data)
        .catch(error => {
            console.error(error);
            throw error;
        });
};

export const updateDistributor = (payload) => {
    return baseApi.post('/distributor/updateDistributor', payload)
        .then(response => response.data)
        .catch(error => {
            console.error(error);
            throw error;
        });
};

export const getDistributorById = (distributorId) => {
    return baseApi.post(`/distributor/getDistributorById/${distributorId}`)
        .then(response => response.data)
        .catch(error => {
            console.error(error);
            throw error;
        });
};

export const getDistributorNameAndId = () => {
    return baseApi.get('/distributor/getAllDistributorIdAndName')
        .then(response => response.data)
        .catch(error => {
            console.error(error);
            throw error;
        });
};