import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Edit2,
  Loader2,
  LogIn,
  Package,
  Plus,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Product } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAddProduct,
  useAllProductsAdmin,
  useDeleteProduct,
  useIsCallerAdmin,
  useToggleProductActive,
  useUpdateProduct,
} from "../hooks/useQueries";

// ── Product Form ──────────────────────────────────────────────────────────────
interface ProductFormData {
  name: string;
  description: string;
  price: string;
  affiliateUrl: string;
  imageUrl: string;
  category: string;
}

const EMPTY_FORM: ProductFormData = {
  name: "",
  description: "",
  price: "",
  affiliateUrl: "",
  imageUrl: "",
  category: "",
};

interface ProductDialogProps {
  open: boolean;
  onClose: () => void;
  editProduct?: Product | null;
}

function ProductDialog({ open, onClose, editProduct }: ProductDialogProps) {
  const [form, setForm] = useState<ProductFormData>(
    editProduct
      ? {
          name: editProduct.name,
          description: editProduct.description,
          price: editProduct.price,
          affiliateUrl: editProduct.affiliateUrl,
          imageUrl: editProduct.imageUrl,
          category: editProduct.category,
        }
      : EMPTY_FORM,
  );

  const addMutation = useAddProduct();
  const updateMutation = useUpdateProduct();
  const isPending = addMutation.isPending || updateMutation.isPending;

  const handleChange = (field: keyof ProductFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.affiliateUrl || !form.category) {
      toast.error("Please fill in all required fields");
      return;
    }
    try {
      if (editProduct) {
        await updateMutation.mutateAsync({ id: editProduct.id, ...form });
        toast.success("Product updated successfully!");
      } else {
        await addMutation.mutateAsync(form);
        toast.success("Product added successfully!");
      }
      onClose();
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        data-ocid="admin.product.dialog"
        className="max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle className="font-display font-bold text-xl">
            {editProduct ? "Edit Product" : "Add New Product"}
          </DialogTitle>
          <DialogDescription className="font-utility text-sm">
            {editProduct
              ? "Update the product details below."
              : "Fill in the details for your new Temu affiliate product."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1.5">
              <Label
                htmlFor="name"
                className="font-utility font-semibold text-sm"
              >
                Product Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                data-ocid="admin.product.input"
                placeholder="Mini LED Ring Light"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
              />
            </div>

            <div className="col-span-2 space-y-1.5">
              <Label
                htmlFor="description"
                className="font-utility font-semibold text-sm"
              >
                Description
              </Label>
              <Textarea
                id="description"
                data-ocid="admin.product.textarea"
                placeholder="Tell people why you love this product..."
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="price"
                className="font-utility font-semibold text-sm"
              >
                Price <span className="text-destructive">*</span>
              </Label>
              <Input
                id="price"
                data-ocid="admin.product.price_input"
                placeholder="$12.99"
                value={form.price}
                onChange={(e) => handleChange("price", e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="category"
                className="font-utility font-semibold text-sm"
              >
                Category <span className="text-destructive">*</span>
              </Label>
              <Input
                id="category"
                data-ocid="admin.product.category_input"
                placeholder="Accessories"
                value={form.category}
                onChange={(e) => handleChange("category", e.target.value)}
                required
              />
            </div>

            <div className="col-span-2 space-y-1.5">
              <Label
                htmlFor="affiliateUrl"
                className="font-utility font-semibold text-sm"
              >
                Affiliate URL <span className="text-destructive">*</span>
              </Label>
              <Input
                id="affiliateUrl"
                data-ocid="admin.product.url_input"
                placeholder="https://www.temu.com/..."
                value={form.affiliateUrl}
                onChange={(e) => handleChange("affiliateUrl", e.target.value)}
                required
              />
            </div>

            <div className="col-span-2 space-y-1.5">
              <Label
                htmlFor="imageUrl"
                className="font-utility font-semibold text-sm"
              >
                Image URL
              </Label>
              <Input
                id="imageUrl"
                data-ocid="admin.product.image_input"
                placeholder="https://..."
                value={form.imageUrl}
                onChange={(e) => handleChange("imageUrl", e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 mt-2">
            <Button
              type="button"
              data-ocid="admin.product.cancel_button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              data-ocid="admin.product.submit_button"
              disabled={isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-coral"
            >
              {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editProduct ? "Save Changes" : "Add Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ── Delete Dialog ─────────────────────────────────────────────────────────────
interface DeleteDialogProps {
  open: boolean;
  product: Product | null;
  onConfirm: () => void;
  onCancel: () => void;
  isPending: boolean;
}

function DeleteDialog({
  open,
  product,
  onConfirm,
  onCancel,
  isPending,
}: DeleteDialogProps) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent data-ocid="admin.delete.dialog">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-display font-bold">
            Delete Product?
          </AlertDialogTitle>
          <AlertDialogDescription className="font-utility text-sm">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">
              {product?.name}
            </span>
            ? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <Button
            data-ocid="admin.delete.cancel_button"
            variant="outline"
            onClick={onCancel}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            data-ocid="admin.delete.confirm_button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Delete Product
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ── Product Row ───────────────────────────────────────────────────────────────
interface ProductRowProps {
  product: Product;
  index: number;
  onEdit: (p: Product) => void;
  onDelete: (p: Product) => void;
}

function ProductRow({ product, index, onEdit, onDelete }: ProductRowProps) {
  const toggleMutation = useToggleProductActive();

  const handleToggle = async () => {
    try {
      await toggleMutation.mutateAsync(product.id);
      toast.success(
        product.isActive ? "Product deactivated" : "Product activated",
      );
    } catch {
      toast.error("Failed to toggle product status");
    }
  };

  return (
    <motion.div
      data-ocid={`admin.product.item.${index + 1}`}
      className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border/60 hover:border-primary/30 transition-colors"
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      {/* Image thumbnail */}
      <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-5 h-5 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-display font-bold text-sm text-foreground truncate">
            {product.name}
          </span>
          <Badge
            variant={product.isActive ? "default" : "secondary"}
            className={`text-xs flex-shrink-0 ${product.isActive ? "bg-primary/15 text-primary border-primary/20 hover:bg-primary/20" : ""}`}
          >
            {product.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-muted-foreground font-utility">
            {product.category}
          </span>
          <span className="text-xs text-muted-foreground">·</span>
          <span className="text-xs font-semibold text-primary font-utility">
            {product.price}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          type="button"
          data-ocid={`admin.product.toggle.${index + 1}`}
          onClick={handleToggle}
          disabled={toggleMutation.isPending}
          className="text-muted-foreground hover:text-primary transition-colors p-1.5 rounded-lg hover:bg-primary/10 disabled:opacity-50"
          title={product.isActive ? "Deactivate" : "Activate"}
        >
          {toggleMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : product.isActive ? (
            <ToggleRight className="w-5 h-5 text-primary" />
          ) : (
            <ToggleLeft className="w-5 h-5" />
          )}
        </button>
        <button
          type="button"
          data-ocid={`admin.product.edit_button.${index + 1}`}
          onClick={() => onEdit(product)}
          className="text-muted-foreground hover:text-primary transition-colors p-1.5 rounded-lg hover:bg-primary/10"
          title="Edit product"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          data-ocid={`admin.product.delete_button.${index + 1}`}
          onClick={() => onDelete(product)}
          className="text-muted-foreground hover:text-destructive transition-colors p-1.5 rounded-lg hover:bg-destructive/10"
          title="Delete product"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

// ── Admin Page ────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const { login, isLoggingIn, identity } = useInternetIdentity();
  const adminQuery = useIsCallerAdmin();
  const productsQuery = useAllProductsAdmin();
  const deleteMutation = useDeleteProduct();

  const [productDialog, setProductDialog] = useState<{
    open: boolean;
    editProduct: Product | null;
  }>({ open: false, editProduct: null });

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    product: Product | null;
  }>({ open: false, product: null });

  const isAdmin = adminQuery.data === true;
  const isCheckingAdmin = adminQuery.isLoading;
  const products = productsQuery.data ?? [];

  const handleEdit = (product: Product) => {
    setProductDialog({ open: true, editProduct: product });
  };

  const handleDelete = (product: Product) => {
    setDeleteDialog({ open: true, product });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.product) return;
    try {
      await deleteMutation.mutateAsync(deleteDialog.product.id);
      toast.success("Product deleted successfully");
      setDeleteDialog({ open: false, product: null });
    } catch {
      toast.error("Failed to delete product");
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto max-w-5xl px-4 h-14 flex items-center gap-4">
          <Link
            to={"/" as never}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors font-utility"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Store
          </Link>
          <div className="flex-1 flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            </div>
            <span className="font-display font-bold text-sm text-foreground">
              Admin Panel
            </span>
          </div>
          {identity && (
            <span className="text-xs text-muted-foreground font-utility hidden sm:block truncate max-w-[140px]">
              {identity.getPrincipal().toString().slice(0, 12)}…
            </span>
          )}
        </div>
      </header>

      <main className="flex-1 container mx-auto max-w-5xl px-4 py-10">
        {/* Loading state */}
        {isCheckingAdmin && (
          <div data-ocid="admin.loading_state" className="space-y-4">
            {["sk1", "sk2", "sk3", "sk4"].map((k) => (
              <Skeleton key={k} className="h-20 w-full rounded-xl" />
            ))}
          </div>
        )}

        {/* Not authenticated */}
        {!isCheckingAdmin && !identity && (
          <motion.div
            className="flex flex-col items-center justify-center py-24 text-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center">
              <LogIn className="w-10 h-10 text-primary" />
            </div>
            <div>
              <h2 className="font-display font-bold text-2xl text-foreground mb-2">
                Login Required
              </h2>
              <p className="text-muted-foreground font-utility text-sm max-w-sm">
                Please log in to access the admin panel.
              </p>
            </div>
            <Button
              onClick={() => login()}
              disabled={isLoggingIn}
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-coral gap-2 font-utility font-semibold"
            >
              {isLoggingIn ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <LogIn className="w-4 h-4" />
              )}
              {isLoggingIn ? "Logging in..." : "Login"}
            </Button>
          </motion.div>
        )}

        {/* Authenticated but not admin */}
        {!isCheckingAdmin && identity && !isAdmin && (
          <motion.div
            className="flex flex-col items-center justify-center py-24 text-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-20 h-20 bg-destructive/10 rounded-3xl flex items-center justify-center">
              <ShieldCheck className="w-10 h-10 text-destructive" />
            </div>
            <div>
              <h2 className="font-display font-bold text-2xl text-foreground mb-2">
                Access Denied
              </h2>
              <p className="text-muted-foreground font-utility text-sm max-w-sm">
                Your account does not have admin privileges.
              </p>
            </div>
            <Link to={"/" as never}>
              <Button variant="outline" className="gap-2 font-utility">
                <ArrowLeft className="w-4 h-4" />
                Back to Store
              </Button>
            </Link>
          </motion.div>
        )}

        {/* Admin content */}
        {!isCheckingAdmin && isAdmin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {/* Page header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="font-display font-extrabold text-3xl text-foreground">
                  Product Management
                </h1>
                <p className="text-muted-foreground font-utility text-sm mt-1">
                  {products.length} product{products.length !== 1 ? "s" : ""}{" "}
                  total
                </p>
              </div>
              <Button
                data-ocid="admin.add_button"
                onClick={() =>
                  setProductDialog({ open: true, editProduct: null })
                }
                className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-coral gap-2 font-utility font-semibold"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Product</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </div>

            {/* Products loading */}
            {productsQuery.isLoading ? (
              <div data-ocid="product.loading_state" className="space-y-3">
                {["sk1", "sk2", "sk3", "sk4", "sk5"].map((k) => (
                  <Skeleton key={k} className="h-20 w-full rounded-xl" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <motion.div
                data-ocid="product.empty_state"
                className="text-center py-20 border-2 border-dashed border-border rounded-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Package className="w-10 h-10 text-muted-foreground/50 mx-auto mb-3" />
                <h3 className="font-display font-bold text-lg text-foreground mb-1">
                  No products yet
                </h3>
                <p className="text-muted-foreground font-utility text-sm mb-4">
                  Add your first Temu affiliate product to get started.
                </p>
                <Button
                  data-ocid="admin.add_button"
                  onClick={() =>
                    setProductDialog({ open: true, editProduct: null })
                  }
                  variant="outline"
                  className="gap-2 font-utility"
                >
                  <Plus className="w-4 h-4" />
                  Add First Product
                </Button>
              </motion.div>
            ) : (
              <div className="space-y-3">
                {products.map((product, i) => (
                  <ProductRow
                    key={product.id.toString()}
                    product={product}
                    index={i}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-6 mt-8">
        <div className="container mx-auto max-w-5xl px-4 text-center">
          <p className="text-xs text-muted-foreground font-utility">
            © {currentYear}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>

      {/* Product Add/Edit Dialog */}
      {productDialog.open && (
        <ProductDialog
          open={productDialog.open}
          editProduct={productDialog.editProduct}
          onClose={() => setProductDialog({ open: false, editProduct: null })}
        />
      )}

      {/* Delete Confirmation */}
      <DeleteDialog
        open={deleteDialog.open}
        product={deleteDialog.product}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteDialog({ open: false, product: null })}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
