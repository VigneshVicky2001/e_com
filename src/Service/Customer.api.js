import baseApi from './baseApi';

export const getAllCustomers = (pageNumber, size, sortBy, sortDirection) => {
    return baseApi.get('/customer/getAllCustomersPagination', {
        params: {
            pageNumber: pageNumber,
            size: size,
            sortBy: sortBy,
            sortDirection: sortDirection
        }
    })
    .then(response => response.data)
    .catch(error => {
        console.error('Error fetching customers:', error);
        throw error;
    });
};