import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { formatter } from "@/lib/utils";

import { OrderColumn } from "./components/columns"
import { OrderClient } from "./components/client";


const OrdersPage = async ({
  params
}: {
  params: { storeId: string }
}) => {
  const orders = await prismadb.order.findMany({
    where: {
      storeId: params.storeId
    },
    include: {
      orderItems: {
        include: {
          product: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
  const formattedOrders: OrderColumn[] = orders.map((item) => ({
    id: item.id,
    contactNumber: item.contactNumber,
    companyName: item.companyName,
    poNumber: item.poNumber,
    address: item.address,
    orderStatus: item.orderStatus,
    products: item.orderItems.map((orderItem) => orderItem.product.name).join(", "),
    // Summing up the totalItemAmount for each orderItem
    totalItemAmount: formatter.format(
      item.orderItems.reduce((total, orderItem) => {
        return total + Number(orderItem.totalItemAmount); // Assuming totalItemAmount is already calculated and stored in the DB
      }, 0)
    ),
    isPaid: item.isPaid,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderClient data={formattedOrders} />
      </div>
    </div>
  );
};

export default OrdersPage;
