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

export async function PATCH(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    if (!params.orderId) {
      return new NextResponse("Order ID is required", { status: 400, headers: corsHeaders });
    }

    const { orderStatus, isPaid, acctgRemarks, acctgAttachedUrl, storeAttachedUrl, storeRemarks } = await req.json();

    // Prepare data to update
    const updateData: {
      orderStatus?: boolean;
      isPaid?: boolean;
      acctgRemarks?: string;
      acctgAttachedUrl?: string;
      storeRemarks?: string;
      storeAttachedUrl?: string;
    } = {};

    if (orderStatus !== undefined) updateData.orderStatus = orderStatus;
    if (isPaid !== undefined) updateData.isPaid = isPaid;
    if (acctgRemarks !== undefined) updateData.acctgRemarks = acctgRemarks;
    if (acctgAttachedUrl !== undefined) updateData.acctgAttachedUrl = acctgAttachedUrl;
    if (storeAttachedUrl !== undefined) updateData.storeAttachedUrl = storeAttachedUrl;
    if (storeRemarks !== undefined) updateData.storeRemarks = storeRemarks;
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