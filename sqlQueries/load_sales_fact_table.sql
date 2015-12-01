Insert into cmpe226star.sales_fact_table (
customerkey, 
productkey,
categorykey, 
shipperkey, 
unitssold, 
totalsales)
SELECT 
    o.customerId,
    p.productId,
    p.categoryId,
    o.shipperId,
    od.quantity,
    od.totalPrice
FROM
    cmpe226.orders o,
    cmpe226.orderdetails od,
    cmpe226.products p
WHERE
    o.orderid = od.OrderId
        AND od.productid = p.productId;
        