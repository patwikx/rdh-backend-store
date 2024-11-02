import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, PATCH",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// Single PATCH function to handle both orderStatus and isPaid updates
export async function PATCH(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    if (!params.orderId) {
      return new NextResponse("Order ID is required", { status: 400, headers: corsHeaders });
    }

    const { orderStatus, isPaid } = await req.json(); // Get data from the request body

    // Prepare data to update
    const updateData: { orderStatus?: boolean; isPaid?: boolean } = {};
    if (orderStatus !== undefined) updateData.orderStatus = orderStatus;
    if (isPaid !== undefined) updateData.isPaid = isPaid;

    // Perform the update in the database
    const updatedOrder = await prismadb.order.update({
      where: { id: params.orderId },
      data: updateData,
    });

    return NextResponse.json(updatedOrder, { headers: corsHeaders });
  } catch (error) {
    console.error('[ORDER_PATCH]', error);
    return new NextResponse("Internal error", { status: 500, headers: corsHeaders });
  }
}
