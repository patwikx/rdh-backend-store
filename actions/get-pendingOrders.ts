import prismadb from "@/lib/prismadb";

export async function getPendingOrders(storeId: string) {
  const orders = await prismadb.order.findMany({
    where: {
      storeId,
      isPaid: false,
    },
    select: {
      id: true,
      clientName: true,
      clientEmail: true,
      totalAmountItemAndShipping: true,
      // Add other fields as needed
    },
  });

  const formattedOrders = orders.map(order => ({
    ...order,
    totalAmountItemAndShipping: order.totalAmountItemAndShipping
      ? order.totalAmountItemAndShipping.toString() // Convert Decimal to string
      : null, // Keep null if there's no value
  }));
  return formattedOrders;
}
