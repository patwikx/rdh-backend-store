import prismadb from "@/lib/prismadb";

interface GraphData {
  name: string;
  total: number;
}

export const getGraphRevenue = async (storeId: string): Promise<GraphData[]> => {
  try {
    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(currentYear, 0, 1); // January 1st of current year
    const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59, 999); // December 31st of current year

    const paidOrders = await prismadb.order.findMany({
      where: {
        storeId,
        isPaid: true,
        createdAt: {
          gte: startOfYear,
          lte: endOfYear,
        },
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    const monthlyRevenue: { [key: number]: number } = {};

    // Initialize all months to 0
    for (let i = 0; i < 12; i++) {
      monthlyRevenue[i] = 0;
    }

    // Grouping the orders by month and summing the revenue
    for (const order of paidOrders) {
      const month = order.createdAt.getMonth();
      const revenueForOrder = order.orderItems.reduce((sum, item) => {
        const price = item.product.price || 0;
        const quantity = typeof item.quantity === 'string' ? parseInt(item.quantity, 10) : (item.quantity || 0);
        return sum + (price * quantity);
      }, 0);

      monthlyRevenue[month] += revenueForOrder;
    }

    // Converting the grouped data into the format expected by the graph
    const graphData: GraphData[] = [
      { name: "Jan", total: 0 },
      { name: "Feb", total: 0 },
      { name: "Mar", total: 0 },
      { name: "Apr", total: 0 },
      { name: "May", total: 0 },
      { name: "Jun", total: 0 },
      { name: "Jul", total: 0 },
      { name: "Aug", total: 0 },
      { name: "Sep", total: 0 },
      { name: "Oct", total: 0 },
      { name: "Nov", total: 0 },
      { name: "Dec", total: 0 },
    ];

    // Filling in the revenue data
    Object.entries(monthlyRevenue).forEach(([month, revenue]) => {
      graphData[parseInt(month)].total = parseFloat(revenue.toFixed(2));
    });

    return graphData;
  } catch (error) {
    console.error("Error in getGraphRevenue:", error);
    throw new Error("Failed to get graph revenue data");
  }
};