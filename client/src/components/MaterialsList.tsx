import { Card } from "@/components/ui/card";
import { Material } from "../lib/types";

interface MaterialsListProps {
  materials: Material[];
}

export default function MaterialsList({ materials }: MaterialsListProps) {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Required Materials</h2>
      
      <div className="space-y-4">
        {materials.map((material) => (
          <div
            key={material.item}
            className="flex justify-between items-center border-b py-2"
          >
            <div>
              <h3 className="font-medium">{material.item}</h3>
              <p className="text-sm text-muted-foreground">
                {material.quantity}
              </p>
            </div>
            <div className="text-right">
              <p className="font-medium">{material.cost}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
