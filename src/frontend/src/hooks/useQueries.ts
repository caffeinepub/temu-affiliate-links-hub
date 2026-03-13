import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Product } from "../backend.d";
import { useActor } from "./useActor";

// ── Queries ──────────────────────────────────────────────────────────────────

export function useAllActiveProducts() {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products", "active"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllActiveProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllCategories() {
  const { actor, isFetching } = useActor();
  return useQuery<string[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCategories();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useProductsByCategory(category: string | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products", "category", category],
    queryFn: async () => {
      if (!actor || !category) return [];
      return actor.getProductsByCategory(category);
    },
    enabled: !!actor && !isFetching && !!category,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

// Admin: fetch ALL products (including inactive)
export function useAllProductsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products", "all-admin"],
    queryFn: async () => {
      if (!actor) return [];
      // We fetch active + inactive by getting all via categories approach
      // Since there's no getAllProducts, we use getAllActiveProducts and also rely on admin context
      const [active, categories] = await Promise.all([
        actor.getAllActiveProducts(),
        actor.getAllCategories(),
      ]);
      // Get products by each category (which may include inactive for admin)
      if (categories.length === 0) return active;
      const byCat = await Promise.all(
        categories.map((c) => actor.getProductsByCategory(c)),
      );
      // Merge and deduplicate
      const all = [...active, ...byCat.flat()];
      const seen = new Set<string>();
      return all.filter((p) => {
        const key = p.id.toString();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    },
    enabled: !!actor && !isFetching,
  });
}

// ── Mutations ─────────────────────────────────────────────────────────────────

export function useAddProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      description: string;
      price: string;
      affiliateUrl: string;
      imageUrl: string;
      category: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addProduct(
        data.name,
        data.description,
        data.price,
        data.affiliateUrl,
        data.imageUrl,
        data.category,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useUpdateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      name: string;
      description: string;
      price: string;
      affiliateUrl: string;
      imageUrl: string;
      category: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateProduct(
        data.id,
        data.name,
        data.description,
        data.price,
        data.affiliateUrl,
        data.imageUrl,
        data.category,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useDeleteProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteProduct(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useToggleProductActive() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.toggleProductActive(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
