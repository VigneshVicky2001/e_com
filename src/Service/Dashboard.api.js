import baseApi from './baseApi';

export const SalesPerMonthOfTheYear = (year) => {
    return baseApi.get(`/dashboard/salesPerMonthOfTheYear?year=${year}`)
        .then(response => response.data)
        .catch(error => {
            console.error(error);
            throw error;
        })
}

export const SalesPerDayOfTheMonth = (year, month) => {
    return baseApi.get(`/dashboard/salesPerDayOfTheMonth?/year=${year}&/month=${month}`)
        .then(response => response.data)
        .catch(error => {
            console.error(error);
            throw error;
        })
}

export const GetStockQtyForAllItems = () => {
    return baseApi.get('/dashboard/getstockQuantityForAllItems')
        .then(response => response.data)
        .catch(error => {
            console.error(error);
            throw error;
        })
}