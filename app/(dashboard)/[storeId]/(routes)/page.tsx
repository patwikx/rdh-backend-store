import { CreditCard, DollarSign, Hourglass, Package } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heading } from "@/components/ui/heading"
import { getTotalRevenue } from "@/actions/get-total-revenue"
import { getSalesCount } from "@/actions/get-sales-count"
import { getGraphRevenue } from "@/actions/get-graph-revenue"
import { getStockCount } from "@/actions/get-stock-count"
import { formatter } from "@/lib/utils"
import Overview from "@/components/overview"
import { getPendingOrders } from "@/actions/get-pendingOrders"
import PendingOrders from "@/components/recent-orders"
import { getDeliveredOrder } from "@/actions/get-delivered-count"


interface DashboardPageProps {
  params: {
    storeId: string
  }
}

const DashboardPage: React.FC<DashboardPageProps> = async ({ params }) => {
  const totalRevenue = await getTotalRevenue(params.storeId)
  const graphRevenue = await getGraphRevenue(params.storeId)
  const salesCount = await getSalesCount(params.storeId)
  const DeliveredCount = await getDeliveredOrder(params.storeId)
  const stockCount = await getStockCount(params.storeId)
  const pendingOrders = await getPendingOrders(params.storeId)

  return (
    <div className="flex">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Heading title="Dashboard" description="Overview of your store" />
        <Separator />
        <div className="grid gap-4 grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Paid Orders</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{salesCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Delivered Orders</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{DeliveredCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
              <Hourglass className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingOrders.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products In Stock</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stockCount}</div>
            </CardContent>
          </Card>
        </div>

        <div className="flex space-x-4 mt-4">
          <div className="flex-1">
            <Overview data={graphRevenue} />
          </div>

          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Pending Orders</CardTitle>
              <CardDescription>
                You have {pendingOrders.length} pending orders.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PendingOrders orders={pendingOrders} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage