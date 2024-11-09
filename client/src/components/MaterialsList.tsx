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
            key={material.name}
            className="flex justify-between items-center border-b py-2"
          >
            <div>
              <h3 className="font-medium">{material.name}</h3>
              <p className="text-sm text-muted-foreground">
                {material.description}
              </p>
            </div>
            <div className="text-right">
              <p className="font-medium">${material.estimatedCost}</p>
              <p className="text-sm text-muted-foreground">
                {material.quantity} {material.unit}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
