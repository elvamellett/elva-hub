import { getProducts } from "@/lib/data";
import { PageHeader, Badge, Table, Th, Td } from "@/components/ui";
import { eur } from "@/lib/cn";

export const dynamic = "force-dynamic";

export default async function InventoryPage() {
  const products = await getProducts();
  const low = products.filter((p) => p.stock <= p.reorderPoint).length;

  return (
    <div>
      <PageHeader
        title="Inventory"
        subtitle={`${products.length} products · ${low} at/below reorder point`}
      />
      <Table>
        <thead>
          <tr><Th>Product</Th><Th>SKU</Th><Th>Type</Th><Th>Price</Th><Th>Stock</Th><Th>Reorder pt.</Th><Th>Status</Th></tr>
        </thead>
        <tbody>
          {products.map((p) => {
            const lowStock = p.stock <= p.reorderPoint;
            return (
              <tr key={p.id} className="hover:bg-paper/60">
                <Td className="font-medium">{p.title}</Td>
                <Td className="text-slate">{p.sku}</Td>
                <Td>{p.type}</Td>
                <Td className="tabular-nums">{eur(p.price)}</Td>
                <Td className="tabular-nums font-medium">{p.stock}</Td>
                <Td className="tabular-nums text-slate">{p.reorderPoint}</Td>
                <Td>
                  {lowStock ? <Badge tone="red">Reorder</Badge> : <Badge tone="green">OK</Badge>}
                </Td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}
