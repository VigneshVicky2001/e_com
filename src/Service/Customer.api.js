import baseApi from './baseApi';

export const getAllCustomers = (pageNumber, size, sortBy, sortDirection) => {
    return baseApi.get('/customer/getAllCustomersPagination', {
        params: {
            pageNumber: pageNumber,    // Use provided page number
            size: size,                // Use provided size
            sortBy: sortBy,            // Use provided sorting field
            sortDirection: sortDirection  // Use provided sorting direction
        }
    })
    .then(response => response.data)
    .catch(error => {
        console.error('Error fetching customers:', error);
        throw error;
    });
};