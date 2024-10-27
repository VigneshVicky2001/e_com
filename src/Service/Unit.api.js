import baseApi from './baseApi';

export const getAllUnits = () => {
    return baseApi.get('/getAllUnits')
        .then(response => response.data)
        .catch(error => {
            console.error(error);
            throw error;
        });
};
