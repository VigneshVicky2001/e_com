import * as yup from 'yup';

export const CategoryValidation = yup.object().shape({
    name: yup.string().required("Name is required"),
    description: yup.string().required("Description is required"),
    gstPercent: yup.string().required("GST is required"),
});

export const ItemValidation = yup.object().shape({
  name: yup.string().required("Name is required"),
  barcode: yup.string()
    .required('Barcode is required')
    .matches(/^\d{13}$/, 'Barcode must be exactly 13 digits long'),
  mrpPrice: yup.string().required("MRP Price is required"),
  sellingPrice: yup.string().required("Selling Price is required"),
  stockQuantity: yup.string().required("Stock quantity is required"),
  status: yup.string().required("Status is required"),
  categoryId: yup.string().required("Category is required"),
  unitId: yup.string().required("Unit is required"),
});

export const StockHistoryValidation = yup.object().shape({
    adjustment_quantity: yup.string().required("Adjustment quantity is required"),
    adjustment_type: yup.string().required("MRP Price is required"),
    distibutorId: yup.string().required("Distributor is required"),
    buyingPrice: yup.string().required("Buying Price is required"),
    itemId: yup.string().required("item is required"),
});

export const DistributorValidation = yup.object().shape({
    name: yup.string().required("Distributor name is required"),
    contactInfo: yup.string()
        .required('Contact info is required')
        .matches(/^\d{10}$/, 'Contact info must be exactly 10 digits long'),
    address: yup.string().required("Address is required"),
});
