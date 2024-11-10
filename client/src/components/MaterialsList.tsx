import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Store, AlertTriangle, Info, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { Material } from "../lib/types";

interface MaterialsListProps {
  materials: Material[];
}

export default function MaterialsList({ materials }: MaterialsListProps) {
  // Use local storage to persist expansion state
  const [expandedItems, setExpandedItems] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem("materialsList.expandedItems");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save expansion state to local storage
  useEffect(() => {
    localStorage.setItem("materialsList.expandedItems", JSON.stringify(expandedItems));
  }, [expandedItems]);

  const toggleItem = (index: number) => {
    setExpandedItems((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  const toggleAll = () => {
    setExpandedItems((prev) =>
      prev.length === materials.length ? [] : materials.map((_, i) => i)
    );
  };

  // Group materials by category
  const groupedMaterials = materials.reduce((acc, material) => {
    const category = material.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(material);
    return acc;
  }, {} as Record<string, Material[]>);

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Required Materials</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={toggleAll}
          className="flex items-center gap-2"
        >
          {expandedItems.length === materials.length ? (
            <>
              <ChevronUpIcon className="w-4 h-4" />
              Collapse All
            </>
          ) : (
            <>
              <ChevronDownIcon className="w-4 h-4" />
              Expand All
            </>
          )}
        </Button>
      </div>
      
      <div className="space-y-8">
        {Object.entries(groupedMaterials).map(([category, categoryMaterials], categoryIndex) => (
          <div key={category} className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">{category}</h3>
            {categoryMaterials.map((material, materialIndex) => {
              const index = materials.indexOf(material);
              const isExpanded = expandedItems.includes(index);
              
              return (
                <div
                  key={material.item}
                  className={`border rounded-lg p-4 transition-all duration-200 ${
                    isExpanded ? 'bg-secondary/10' : ''
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium text-lg">{material.item}</h4>
                        <p className="font-medium">{material.cost}</p>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Quantity: {material.quantity}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`ml-4 transition-transform duration-200 ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                      onClick={() => toggleItem(index)}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </div>

                  <div
                    className={`grid transition-[grid-template-rows] duration-200 ${
                      isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="mt-4 space-y-4 border-t pt-4">
                        {material.specifications && (
                          <div>
                            <h4 className="font-medium mb-1 flex items-center gap-2">
                              <Info className="w-4 h-4" />
                              Specifications
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {material.specifications}
                            </p>
                          </div>
                        )}

                        {material.recommendedBrands && material.recommendedBrands.length > 0 && (
                          <div>
                            <h4 className="font-medium mb-1">Recommended Brands</h4>
                            <ul className="list-disc list-inside text-sm text-muted-foreground">
                              {material.recommendedBrands.map((brand) => (
                                <li key={brand}>{brand}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {material.alternativeOptions && material.alternativeOptions.length > 0 && (
                          <div>
                            <h4 className="font-medium mb-1">Alternative Options</h4>
                            <ul className="list-disc list-inside text-sm text-muted-foreground">
                              {material.alternativeOptions.map((option) => (
                                <li key={option}>{option}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {material.whereToBuy && material.whereToBuy.length > 0 && (
                          <div>
                            <h4 className="font-medium mb-1 flex items-center gap-2">
                              <Store className="w-4 h-4" />
                              Where to Buy
                            </h4>
                            <ul className="list-disc list-inside text-sm text-muted-foreground">
                              {material.whereToBuy.map((store) => (
                                <li key={store}>{store}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {material.usageInstructions && (
                          <div>
                            <h4 className="font-medium mb-1">Usage Instructions</h4>
                            <p className="text-sm text-muted-foreground">
                              {material.usageInstructions}
                            </p>
                          </div>
                        )}

                        {material.importantNotes && (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 flex items-start gap-2">
                            <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                            <p className="text-sm text-yellow-700">
                              {material.importantNotes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </Card>
  );
}
