import baseApi from './baseApi';

export const getCategories = (payload) => {
    return baseApi.post('/category/getAllCategoriesWithFilter',payload)
        .then(response => response.data)
        .catch(error => {
            console.error(error);
            throw error;
        });
};

export const addCategory = (payload) => {
    return baseApi.post('/category/add', payload)
        .then(response => response.data)
        .catch(error => {
            console.error(error);
            throw error;
        });
};

export const getCategoriesDropdown = () => {
    return baseApi.get('/category/getCategoriesDropdown')
        .then(response => response.data)
        .catch(error => {
            console.error(error);
            throw error;
        });
};

export const getCategoryById = (categoryId) => {
    return baseApi.get(`/category/getCategoryById/${categoryId}`)
        .then(response => response.data)
        .catch(error => {
            console.error(error);
            throw error;
        });
};

export const updateCategory = (payload) => {
    return baseApi.post('/category/update', payload)
        .then(response => response.data)
        .catch(error => {
            console.error(error);
            throw error;
        });
};


export const getAllCategories = () => {
    return baseApi.get('/category/getAllCategories')
        .then(response => response.data)
        .catch(error => {
            console.error(error);
            throw error;
        });
};