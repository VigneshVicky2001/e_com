import baseApi from './baseApi';


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

export const getAllRestockHistory = (sortOrder, startDate, endDate, page, size) => {
    return baseApi.get('/restockhistory/getRestockHistoriesWithPagination', {
        params: {
            sortOrder: sortOrder || 'DESC',
            startDate: startDate ? startDate.toISOString().slice(0, -1) : undefined,
            endDate: endDate ? endDate.toISOString().slice(0, -1) : undefined,
            page: page || 0,
            size: size || 10,
        }
    })
    .then(response => response.data)
    .catch(error => {
        console.error('Error fetching customers:', error);
        throw error;
    });
};
