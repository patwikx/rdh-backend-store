'use client'

import axios from "axios";
import { BadgeDollarSign, CheckCheck, MoreHorizontal, ShoppingBagIcon, UploadCloud } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { OrderColumn } from "./columns";
import { LucideTruck } from "lucide-react";

// Import the necessary types from upload-thing
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { UploadButton } from "@uploadthing/react";

interface CellActionProps {
  data: OrderColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [openDelivered, setOpenDelivered] = useState(false);
  const [openPaidDialog, setOpenPaidDialog] = useState(false);
  const [uploadedFileNames, setUploadedFileNames] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
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

  const handleFileUpload = (res: any) => {
    setUploadedFileNames(res.map((file: any) => file.url));
  };

  const onConfirmPaid = async () => {
    try {
      setLoading(true);
      await axios.patch(`/api/${params.storeId}/orders/${data.id}`, { 
        isPaid: true,
        acctgRemarks: notes,
        acctgAttachedUrl: uploadedFileNames[0] // This now contains the URL
      });
      toast.success('Order marked as paid.');
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
      setOpenPaidDialog(false);
    }
  };

  return (
    <>
      <AlertModal 
        isOpen={openDelivered} 
        onClose={() => setOpenDelivered(false)}
        onConfirm={onConfirmDelivered}
        loading={loading}
      />
      <Dialog open={openPaidDialog} onOpenChange={setOpenPaidDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark Order as Paid</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter any additional notes..."
              />
            </div>
            <div>
              <h3 className="text-md font-medium mb-2">Attach Approved P.O</h3>
              <div className="flex flex-col items-center p-4 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:border-gray-600 transition duration-300">
                <UploadButton<OurFileRouter, "approvedPOUrl">
                  endpoint="approvedPOUrl"
                  onClientUploadComplete={handleFileUpload}
                  onUploadError={(error: Error) => {
                    toast.error(`Upload ERROR! ${error.message}`)
                  }}
                />
                <span className="text-gray-500 mt-2">Drag & Drop or Click to Upload</span>
              </div>
              {uploadedFileNames.length > 0 && (
                <div className="mt-2 text-sm text-gray-600">
                  <Label className="font-bold">Uploaded file: </Label>
                  <ul className="list-disc pl-5">
                    <li>{uploadedFileNames[0].split('/').pop()}</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenPaidDialog(false)}>Cancel</Button>
            <Button onClick={onConfirmPaid} disabled={loading}>
              {loading ? 'Processing...' : 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
            onClick={() => setOpenPaidDialog(true)}
          >
            <BadgeDollarSign className="mr-2 h-4 w-4" /> Mark as paid
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}