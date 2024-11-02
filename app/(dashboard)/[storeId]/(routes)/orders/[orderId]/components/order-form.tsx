"use client";

import { Copy, MoreVertical, Truck, Check, Printer, FileText } from "lucide-react";
import { Order, OrderItem, Product } from "@prisma/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect } from "react";

interface OrderFormProps {
  initialData: Order & {
    orderItems: (OrderItem & {
      product: Product & { 
        price: number;
        barCode: string;
        itemDesc: string;
      };
      totalItemAmount: number | null;
    })[];
    attachedPOUrl: string; // Remove the optional '?' to ensure it's required
  };
}

export const OrdersForm: React.FC<OrderFormProps> = ({ initialData }) => {
  const totalPrice = initialData.orderItems.reduce((acc, item) => {
    return acc + (item.totalItemAmount || 0);
  }, 0);

  const formattedTotalPrice = totalPrice.toLocaleString('en-US', { style: 'currency', currency: 'PHP' });

  const formatCurrency = (amount: number | null): string => {
    return amount?.toLocaleString('en-US', { style: 'currency', currency: 'PHP' }) || '₱0.00';
  };

  console.log('PO URL:', initialData.attachedPOUrl);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @media print {
        body * {
          visibility: hidden;
        }
        .print-content, .print-content * {
          visibility: visible;
        }
        .print-content {
          position: absolute;
          left: 0;
          top: 0;
        }
        .no-print {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <Card className="overflow-hidden print-content">
      <CardHeader className="bg-muted/50">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl mb-2">{initialData.companyName}</CardTitle>
            <CardDescription>{initialData.address}</CardDescription>
            <CardDescription>{initialData.contactNumber}</CardDescription>
          </div>
          <div className="flex items-center gap-2 no-print">
            <Button 
              size="sm" 
              variant={initialData.orderStatus ? "outline" : "default"}
              className="h-8 gap-1"
            >
              {initialData.orderStatus ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Delivered</span>
                </>
              ) : (
                <>
                  <Truck className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Order Processing</span>
                </>
              )}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-8 gap-1"
              onClick={handlePrint}
            >
              <Printer className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Print</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-8 gap-1"
              onClick={() => {
                console.log('Attempting to open PO:', initialData.attachedPOUrl);
                if (initialData.attachedPOUrl) {
                  window.open(initialData.attachedPOUrl, '_blank');
                } else {
                  console.log('No PO URL available');
                }
              }}
            >
              <FileText className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">View PO</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="outline" className="h-8 w-8">
                  <MoreVertical className="h-3.5 w-3.5" />
                  <span className="sr-only">More</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem>Export</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Trash</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="mt-4 space-y-1">
          <CardTitle className="text-lg flex items-center gap-2">
            Order ID: {initialData.id}
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 no-print"
              onClick={() => navigator.clipboard.writeText(initialData.id)}
            >
              <Copy className="h-3 w-3" />
              <span className="sr-only">Copy Order ID</span>
            </Button>
          </CardTitle>
          <CardTitle className="text-lg flex items-center gap-2">
            PO Number: {initialData.poNumber}
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 no-print"
              onClick={() => navigator.clipboard.writeText(initialData.poNumber)}
            >
              <Copy className="h-3 w-3" />
              <span className="sr-only">Copy PO Number</span>
            </Button>
          </CardTitle>
          <CardDescription>Date: {new Date(initialData.createdAt).toLocaleDateString()}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Barcode</TableHead>
              <TableHead>Item Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialData.orderItems.map((item) => (
              <TableRow key={item.productId}>
                <TableCell>{item.product.barCode}</TableCell>
                <TableCell>{item.product.name}</TableCell>
                <TableCell>{item.product.itemDesc}</TableCell>
                <TableCell className="text-right">{item.quantity}</TableCell>
                <TableCell className="text-right">{formatCurrency(item.product.price)}</TableCell>
                <TableCell className="text-right">{formatCurrency(item.totalItemAmount)}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={5} className="font-bold text-right">Total</TableCell>
              <TableCell className="font-bold text-right">{formattedTotalPrice}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex flex-col items-start bg-muted/50 p-6 gap-4">
        <div>
          <h3 className="font-semibold mb-2">Delivery Address / Contact Person Information</h3>
          <p>{initialData.address}</p>
          <p>{initialData.contactNumber}</p>
        </div>
        <div className="text-xs text-muted-foreground">
          Updated <time dateTime={initialData.updatedAt.toISOString()}>{new Date(initialData.updatedAt).toLocaleDateString()}</time>
        </div>
      </CardFooter>
    </Card>
  );
};

export default OrdersForm;