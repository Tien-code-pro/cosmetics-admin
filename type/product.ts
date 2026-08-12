export type Category = {
  id: string;
  name: string;
};

export type Spec = {
  key: string;
  value: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  stock: number;
  categoryId: string | null;
  category?: Category;
  images: string[];
  shortDescription: string | null;
  description: string | null;
  ingredients: string | null;
  usageInstructions: string | null;
  brand: string | null;
  origin: string | null;
  specifications: Record<string, string> | null;
};
