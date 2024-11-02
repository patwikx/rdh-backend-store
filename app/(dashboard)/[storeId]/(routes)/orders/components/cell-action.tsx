'use client'

import axios from "axios";
import { CheckCheck, Edit, MoreHorizontal, ShoppingBagIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import { OrderColumn } from "./columns";
import { toast } from "sonner";
import { LucideTruck } from "lucide-react";

interface CellActionProps {
  data: OrderColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [openDelivered, setOpenDelivered] = useState(false);  // Separate state for "Mark as Delivered"
  const [openPaid, setOpenPaid] = useState(false);  // Separate state for "Mark as Paid"
  const router = useRouter();
  const params = useParams();

  const onConfirmDelivered = async () => {
    try {
      setLoading(true);
      await axios.patch(`/api/${params.storeId}/orders/${data.id}`, { orderStatus: true });
      toast.success('Order marked as delivered.');
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
      setOpenDelivered(false);
    }
  };

  const onConfirmPaid = async () => {
    try {
      setLoading(true);
      await axios.patch(`/api/${params.storeId}/orders/${data.id}`, { isPaid: true });
      toast.success('Order marked as paid.');
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
      setOpenPaid(false);
    }
  };

  return (
    <>
      {/* Alert modal for marking as delivered */}
      <AlertModal 
        isOpen={openDelivered} 
        onClose={() => setOpenDelivered(false)}
        onConfirm={onConfirmDelivered}
        loading={loading}
      />
      {/* Alert modal for marking as paid */}
      <AlertModal 
        isOpen={openPaid} 
        onClose={() => setOpenPaid(false)}
        onConfirm={onConfirmPaid}
        loading={loading}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => router.push(`/${params.storeId}/orders/${data.id}`)}
          >
            <ShoppingBagIcon className="mr-2 h-4 w-4" /> View Order Details
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setOpenDelivered(true)}
          >
            <LucideTruck className="mr-2 h-4 w-4" /> Mark as delivered
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setOpenPaid(true)}
          >
            <CheckCheck className="mr-2 h-4 w-4" /> Mark as paid
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
