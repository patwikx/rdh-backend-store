"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action";
import { Badge } from "@/components/ui/badge";

export type OrderColumn = {
  id: string;
  address: string;
  isPaid: boolean;
  totalItemAmount: string;
  products: string;
  createdAt: string;
  contactNumber: string;
  companyName: string;
  poNumber: string;
  orderStatus: boolean;
}

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "id",
    header: "Order ID",
  },
  {
    accessorKey: "companyName",
    header: "Company",
  },
  {
    accessorKey: "poNumber",
    header: "PO #",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "contactNumber",
    header: "Contact #",
  },
  {
    accessorKey: "totalItemAmount",
    header: "Total Amount",
  },
  {
    accessorKey: "orderStatus",
    header: "Order Status",
    cell: ({ row }) => {
      const status = row.getValue("orderStatus") as boolean
      
      return (
        <Badge variant={status ? "default" : "destructive"}>
          {status ? "Served" : "Unserved"}
        </Badge>
      )
    }
  },
  {
    accessorKey: "isPaid",
    header: "Payment Status",
    cell: ({ row }) => {
      const status = row.getValue("isPaid") as boolean
      
      return (
        <Badge variant={status ? "default" : "destructive"}>
          {status ? "Paid" : "Unpaid"}
        </Badge>
      )
    }
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
];
