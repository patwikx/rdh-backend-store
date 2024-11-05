import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


interface Order {
  id: string;
  clientName: string;
  clientEmail: string;
  totalAmountItemAndShipping: string | null;
}

interface PendingOrdersProps {
  orders: Order[];
}

export default function PendingOrders({ orders }: PendingOrdersProps) {
  return (
    <div className="space-y-8">
      {orders.map((order) => (
        <div key={order.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={`/placeholder.svg?height=36&width=36`} alt={order.clientName} />
            <AvatarFallback>{order.clientName.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{order.clientName}</p>
            <p className="text-sm text-muted-foreground">{order.clientEmail}</p>
          </div>
          <div className="ml-auto font-medium">
          {order.totalAmountItemAndShipping 
    ? `₱${parseFloat(order.totalAmountItemAndShipping).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : 'N/A'}
          </div>
        </div>
      ))}
    </div>
  )
}