import prismadb from "@/lib/prismadb";

export const getDeliveredOrder = async (storeId: string) => {
  const salesCount = await prismadb.order.count({
    where: {
      storeId,
      orderStatus: true
    },
  });

  return salesCount;
};
