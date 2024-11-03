import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { orderItems, companyName, poNumber, address, contactNumber, clientName, clientEmail, attachedPOUrl, deliveryMethod, selectedDate, shippingFee, totalAmountItemAndShipping } = await req.json();

    // Extract productsId, quantities, and totalItemAmounts from orderItems
    const productsId = orderItems.map((item: any) => item.productId);
    const quantities = orderItems.map((item: any) => item.quantity);
    const totalItemAmounts = orderItems.map((item: any) => item.totalItemAmount);

    // Validate inputs
    if (!productsId || productsId.length === 0) {
      return new NextResponse("Product IDs are required", { status: 400, headers: corsHeaders });
    }
    if (!quantities || quantities.length !== productsId.length) {
      return new NextResponse("Quantities must be provided for all product IDs", { status: 400, headers: corsHeaders });
    }
    if (!totalItemAmounts || totalItemAmounts.length !== productsId.length) {
      return new NextResponse("Total item amounts must be provided for all product IDs", { status: 400, headers: corsHeaders });
    }
    if (!companyName || !poNumber || !contactNumber) {
      return new NextResponse("All delivery information fields are required", { status: 400, headers: corsHeaders });
    }
    if (!attachedPOUrl) {
      return new NextResponse("Approved PO is required", { status: 400, headers: corsHeaders });
    }

    // Fetch the products
    const products = await prismadb.product.findMany({
      where: {
        id: {
          in: productsId
        }
      }
    });

    if (products.length === 0) {
      return new NextResponse("No products found with the given IDs", { status: 404, headers: corsHeaders });
    }

    // Create the order with delivery information, quantities, and total item amounts
    const order = await prismadb.order.create({
      data: {
        storeId: params.storeId,
        isPaid: false,
        clientEmail,
        clientName,
        companyName,
        deliveryMethod,
        poNumber,
        selectedDate,
        shippingFee,
        contactNumber,
        address,
        attachedPOUrl,
        totalAmountItemAndShipping,
        orderItems: {
          create: productsId.map((productId: string, index: number) => ({
            product: {
              connect: {
                id: productId
              }
            },
            quantity: quantities[index].toString(), // Convert quantity to string
            totalItemAmount: totalItemAmounts[index], // Store the totalItemAmount in the database
          }))
        }
      }
    });

    return NextResponse.json(
      {
        message: "Order created successfully",
        orderId: order.id,
        products,
        deliveryInfo: {
          companyName,
          poNumber,
          address,
          contactNumber,
        }
      },
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return new NextResponse("Internal Server Error", { status: 500, headers: corsHeaders });
  }
}