import { getOrders } from "@/lib/data";
import { PageHeader, Badge, Table, Th, Td } from "@/components/ui";
import { eur, timeAgoDate } from "@/lib/cn";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const orders = await getOrders();
  const revenue = orders.filter((o) => o.financialStatus !== "refunded").reduce((s, o) => s + o.total, 0);

  return (
    <div>
      <PageHeader
        title="Orders"
        subtitle={`${orders.length} recent orders · ${eur(revenue, orders[0]?.currency ?? "EUR")} (excl. refunds)`}
      />
      <Table>
        <thead>
          <tr><Th>Order</Th><Th>Customer</Th><Th>Items</Th><Th>Total</Th><Th>Payment</Th><Th>Fulfilment</Th><Th>Placed</Th></tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="hover:bg-paper/60">
              <Td className="font-medium">{o.name}</Td>
              <Td>{o.customer}</Td>
              <Td className="tabular-nums">{o.items}</Td>
              <Td className="tabular-nums font-medium">{eur(o.total, o.currency)}</Td>
              <Td>
                <Badge tone={o.financialStatus === "paid" ? "green" : o.financialStatus === "refunded" ? "red" : "amber"}>
                  {o.financialStatus}
                </Badge>
              </Td>
              <Td>
                <Badge tone={o.fulfillmentStatus === "fulfilled" ? "green" : o.fulfillmentStatus === "partial" ? "amber" : "blue"}>
                  {o.fulfillmentStatus}
                </Badge>
              </Td>
              <Td className="whitespace-nowrap text-slate">{timeAgoDate(o.createdAt)}</Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
