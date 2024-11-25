import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Store, AlertTriangle, Info, ChevronDownIcon, ChevronUpIcon, Search, ExternalLink } from "lucide-react";
import { Material, Product } from "../lib/types";
import useSWR from "swr";

interface MaterialsListProps {
  materials: Material[];
}

  export default function MaterialsList({ materials }: MaterialsListProps) {
  const [searchingMaterial, setSearchingMaterial] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<{ products: Product[] } | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  const searchProducts = async (query: string) => {
    try {
      setSearchError(null);
      const response = await fetch(`/api/search-products?query=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      if (!response.ok) {
        console.error("Product search failed:", {
          status: response.status,
          error: data.error,
          details: data.details
        });
        throw new Error(data.error || "Failed to load products");
      }
      
      setSearchResults(data);
    } catch (error) {
      console.error("Error searching products:", error);
      setSearchError(error instanceof Error ? error.message : "Failed to load products");
      setSearchResults(null);
    }
  };

  useEffect(() => {
    if (searchingMaterial) {
      searchProducts(searchingMaterial);
    } else {
      setSearchResults(null);
      setSearchError(null);
    }
  }, [searchingMaterial]);
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
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSearchingMaterial(material.item)}
                      >
                        <Search className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`transition-transform duration-200 ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                        onClick={() => toggleItem(index)}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </div>
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
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium mb-1">Usage Instructions</h4>
                              <p className="text-sm text-muted-foreground">
                                {material.usageInstructions}
                              </p>
                            </div>

                            {searchingMaterial === material.item && (
                              <div className="mt-4 border-t pt-4">
                                <div className="flex justify-between items-center mb-4">
                                  <h4 className="font-medium">Available Products</h4>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSearchingMaterial(null)}
                                  >
                                    <ChevronUp className="h-4 w-4" />
                                  </Button>
                                </div>
                                {searchError ? (
                                  <div className="text-sm text-destructive space-y-2">
                                    <p>Failed to load products: {searchError}</p>
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      onClick={() => searchProducts(material.item)}
                                    >
                                      Retry Search
                                    </Button>
                                  </div>
                                ) : !searchResults ? (
                                  <div className="flex justify-center py-4">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
                                  </div>
                                ) : searchResults.products.length === 0 ? (
                                  <p className="text-sm text-muted-foreground">No products found</p>
                                ) : (
                                  <div className="grid gap-4">
                                    {searchResults.products.map((product, i) => (
                                      <a
                                        key={i}
                                        href={product.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-start gap-4 p-4 rounded-lg hover:bg-secondary/50 transition-colors"
                                      >
                                        {product.thumbnail && (
                                          <img
                                            src={product.thumbnail}
                                            alt={product.title}
                                            className="w-20 h-20 object-cover rounded-md"
                                          />
                                        )}
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-start justify-between gap-2">
                                            <h5 className="font-medium text-sm line-clamp-2">
                                              {product.title}
                                            </h5>
                                            <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
                                          </div>
                                          <p className="text-sm font-medium mt-1">{product.price}</p>
                                          {product.rating && (
                                            <div className="flex items-center gap-2 mt-1">
                                              <div className="flex">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                  <span
                                                    key={i}
                                                    className={`text-sm ${
                                                      i < Math.round(product.rating)
                                                        ? "text-yellow-400"
                                                        : "text-muted"
                                                    }`}
                                                  >
                                                    ★
                                                  </span>
                                                ))}
                                              </div>
                                              {product.reviews && (
                                                <span className="text-xs text-muted-foreground">
                                                  ({product.reviews})
                                                </span>
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      </a>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
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
