import prismadb from "@/lib/prismadb";
import { OrdersForm } from "./components/order-form";
import { CardTitle } from "@/components/ui/card";

const OrderDetailsPage = async ({
  params
}: {
  params: { orderId: string, storeId: string }
}) => {
  const order = await prismadb.order.findUnique({
    where: {
      id: params.orderId,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) {
    return <div>Order not found</div>;
  }

  // Convert Decimal fields to numbers and handle potential null values
  const formattedOrder = {
    ...order,
    orderItems: order.orderItems.map(item => ({
      ...item,
      product: {
        ...item.product,
        price: parseFloat(item.product.price.toString()),
        itemDesc: item.product.itemDesc || "",
      },
      totalItemAmount: item.totalItemAmount ? parseFloat(item.totalItemAmount.toString()) : null,
    })),
  };

  return ( 
    <div className="flex-col">
      <CardTitle className="mt-6 ml-8 font-bold text-xl">Order Details</CardTitle>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrdersForm initialData={formattedOrder} />
      </div>
    </div>
  );
}

export default OrderDetailsPage;