import { SimpleTable } from "@/components/ui/DataTable/SimpleTable";
import { Material } from "@/DTO/tender";
import { ColumnDef } from "@tanstack/react-table";

export function MaterialsTable({ materials }: { materials: Material[] }) {
  return (
    <SimpleTable
      columns={getColumns()}
      data={materials}
      noRowsText="No materials found"
    />
  );
}

function getColumns(): ColumnDef<Material>[] {
  return [
    {
      accessorKey: "name",
      header: "Benämning",
      size: 250,
      maxSize: 250,
      cell: ({ row }) => {
        return row.original.Benämning;
      },
    },
    {
      accessorKey: "amount",
      header: "Mängd",
      size: 75,
      maxSize: 75,
      cell: ({ row }) => {
        return row.original.Mängd;
      },
    },
    {
      accessorKey: "unit",
      header: "Enhet",
      size: 50,
      maxSize: 50,
      cell: ({ row }) => {
        return row.original.Enhet;
      },
    },
  ];
}
