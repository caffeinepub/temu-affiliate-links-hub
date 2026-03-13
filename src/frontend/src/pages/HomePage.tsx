import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import {
  ExternalLink,
  Settings,
  ShoppingBag,
  Smartphone,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Product } from "../backend.d";
import {
  useAllActiveProducts,
  useAllCategories,
  useProductsByCategory,
} from "../hooks/useQueries";

// ── Seed data for first-load experience ──────────────────────────────────────
const SEED_PRODUCTS: Product[] = [
  {
    id: BigInt(1),
    name: "Mini LED Ring Light",
    description:
      "Perfect clip-on ring light that fits on any phone. Game-changer for content creation and video calls.",
    price: "$8.99",
    affiliateUrl: "https://www.temu.com",
    imageUrl: "/assets/generated/product-ring-light.dim_400x400.jpg",
    category: "Lighting",
    isActive: true,
    createdAt: BigInt(0),
  },
  {
    id: BigInt(2),
    name: "Wireless Earbuds Pro",
    description:
      "Crystal-clear sound with 30hr battery life. I use these every single day for podcasts and calls.",
    price: "$19.99",
    affiliateUrl: "https://www.temu.com",
    imageUrl: "/assets/generated/product-earbuds.dim_400x400.jpg",
    category: "Audio",
    isActive: true,
    createdAt: BigInt(0),
  },
  {
    id: BigInt(3),
    name: "Adjustable Phone Stand",
    description:
      "Hands-free viewing at any angle. Essential for watching courses or filming content.",
    price: "$12.49",
    affiliateUrl: "https://www.temu.com",
    imageUrl: "/assets/generated/product-phone-stand.dim_400x400.jpg",
    category: "Accessories",
    isActive: true,
    createdAt: BigInt(0),
  },
  {
    id: BigInt(4),
    name: "20,000mAh Power Bank",
    description:
      "Never run out of battery hustling on-the-go. Charges my phone 5x before needing a recharge.",
    price: "$24.99",
    affiliateUrl: "https://www.temu.com",
    imageUrl: "/assets/generated/product-powerbank.dim_400x400.jpg",
    category: "Accessories",
    isActive: true,
    createdAt: BigInt(0),
  },
  {
    id: BigInt(5),
    name: "Aluminum Laptop Stand",
    description:
      "Elevates my setup, reduces neck strain, and looks incredibly sleek on any desk.",
    price: "$29.99",
    affiliateUrl: "https://www.temu.com",
    imageUrl: "/assets/generated/product-laptop-stand.dim_400x400.jpg",
    category: "Desk Setup",
    isActive: true,
    createdAt: BigInt(0),
  },
  {
    id: BigInt(6),
    name: "Compact Bluetooth Keyboard",
    description:
      "Type anywhere, anytime. Works perfectly with phones, tablets, and laptops.",
    price: "$22.99",
    affiliateUrl: "https://www.temu.com",
    imageUrl: "/assets/generated/product-keyboard.dim_400x400.jpg",
    category: "Desk Setup",
    isActive: true,
    createdAt: BigInt(0),
  },
];

const SEED_CATEGORIES = ["Lighting", "Audio", "Accessories", "Desk Setup"];

// ── Product Card ──────────────────────────────────────────────────────────────
function ProductCard({ product, index }: { product: Product; index: number }) {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.article
      data-ocid={`product.item.${index + 1}`}
      className="product-card-hover group bg-card rounded-2xl overflow-hidden shadow-card flex flex-col"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-muted aspect-square">
        {imgError ? (
          <div className="w-full h-full flex items-center justify-center bg-accent/30">
            <ShoppingBag className="w-12 h-12 text-primary/40" />
          </div>
        ) : (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        )}
        <div className="absolute top-3 left-3">
          <Badge
            variant="secondary"
            className="text-xs font-utility font-semibold bg-white/90 text-foreground border-0 shadow-xs backdrop-blur-sm"
          >
            {product.category}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        <div className="flex-1">
          <h3 className="font-display font-bold text-base text-foreground leading-snug mb-1.5">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/50">
          <span className="font-display font-extrabold text-lg text-primary">
            {product.price}
          </span>
          <Button
            data-ocid={`product.button.${index + 1}`}
            size="sm"
            className="gap-1.5 font-utility font-semibold text-xs bg-primary text-primary-foreground hover:bg-primary/90 shadow-coral transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
            onClick={() =>
              window.open(product.affiliateUrl, "_blank", "noopener,noreferrer")
            }
          >
            Shop on Temu
            <ExternalLink className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </motion.article>
  );
}

// ── Skeleton Card ─────────────────────────────────────────────────────────────
function ProductCardSkeleton() {
  return (
    <div className="bg-card rounded-2xl overflow-hidden shadow-card">
      <Skeleton className="aspect-square w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex justify-between items-center pt-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-8 w-28 rounded-md" />
        </div>
      </div>
    </div>
  );
}

// ── Home Page ─────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categoriesQuery = useAllCategories();
  const allProductsQuery = useAllActiveProducts();
  const catProductsQuery = useProductsByCategory(
    activeCategory !== "All" ? activeCategory : null,
  );

  const categories = categoriesQuery.data?.length
    ? ["All", ...categoriesQuery.data]
    : ["All", ...SEED_CATEGORIES];

  // Determine which products to show
  const isLoading =
    activeCategory === "All"
      ? allProductsQuery.isLoading
      : catProductsQuery.isLoading;

  const rawProducts =
    activeCategory === "All" ? allProductsQuery.data : catProductsQuery.data;

  const products = rawProducts?.length
    ? rawProducts
    : allProductsQuery.isLoading || catProductsQuery.isLoading
      ? undefined
      : SEED_PRODUCTS.filter(
          (p) => activeCategory === "All" || p.category === activeCategory,
        );

  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* ── Header ── */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-coral">
              <Smartphone className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-foreground text-sm sm:text-base">
              PhoneHustle
            </span>
          </div>
          <Link
            to={"/admin" as never}
            data-ocid="admin.link"
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors font-utility"
          >
            <Settings className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Admin</span>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* ── Hero ── */}
        <section
          data-ocid="hero.section"
          className="hero-gradient relative overflow-hidden grain-overlay"
        >
          <div className="container mx-auto max-w-6xl px-4 py-16 sm:py-24 lg:py-28">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Text */}
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-utility font-semibold mb-4">
                    <Sparkles className="w-3.5 h-3.5" />
                    Affiliate Picks
                  </div>
                  <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-foreground leading-[1.1] tracking-tight">
                    How I Make{" "}
                    <span className="gradient-text">Passive Income</span> Using
                    Only My Phone <span className="text-primary">📱</span>
                  </h1>
                </motion.div>

                <motion.p
                  className="text-lg text-muted-foreground leading-relaxed max-w-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  Everything you need for your setup — my top Temu picks with
                  affiliate links. I use every single one of these products to
                  run my content business from my phone.
                </motion.p>

                <motion.div
                  className="flex flex-wrap gap-4 items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="flex items-center gap-2 text-sm text-muted-foreground font-utility">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <span>Real gear, real results</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground font-utility">
                    <ShoppingBag className="w-4 h-4 text-primary" />
                    <span>Budget-friendly Temu finds</span>
                  </div>
                </motion.div>
              </div>

              {/* Hero Image */}
              <motion.div
                className="hidden lg:block relative"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.15 }}
              >
                <div className="relative rounded-3xl overflow-hidden shadow-[0_32px_64px_oklch(0.62_0.22_38_/_0.25)]">
                  <img
                    src="/assets/generated/hero-passive-income.dim_1200x600.jpg"
                    alt="Passive income from phone"
                    className="w-full h-80 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 via-transparent to-transparent" />
                </div>
                {/* Floating badge */}
                <motion.div
                  className="absolute -bottom-4 -left-4 bg-card rounded-2xl shadow-card px-4 py-3 flex items-center gap-3"
                  animate={{ y: [0, -6, 0] }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 3,
                    ease: "easeInOut",
                  }}
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground font-utility">
                      Monthly affiliate income
                    </div>
                    <div className="font-display font-bold text-foreground">
                      $500–$2,000+
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Category Tabs + Products ── */}
        <section className="container mx-auto max-w-6xl px-4 py-12">
          {/* Category Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-8 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                data-ocid="category.tab"
                onClick={() => setActiveCategory(cat)}
                className={`
                  flex-shrink-0 px-4 py-2 rounded-full text-sm font-utility font-semibold transition-all duration-200
                  ${
                    activeCategory === cat
                      ? "bg-primary text-primary-foreground shadow-coral"
                      : "bg-secondary text-secondary-foreground hover:bg-accent/60 hover:text-accent-foreground"
                  }
                `}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <div data-ocid="product.list">
            {isLoading ? (
              <div
                data-ocid="product.loading_state"
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
              >
                {["sk1", "sk2", "sk3", "sk4", "sk5", "sk6"].map((k) => (
                  <ProductCardSkeleton key={k} />
                ))}
              </div>
            ) : products && products.length > 0 ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory}
                  className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {products.map((product, i) => (
                    <ProductCard
                      key={product.id.toString()}
                      product={product}
                      index={i}
                    />
                  ))}
                </motion.div>
              </AnimatePresence>
            ) : (
              <motion.div
                data-ocid="product.empty_state"
                className="text-center py-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="w-8 h-8 text-primary/60" />
                </div>
                <h3 className="font-display font-bold text-xl text-foreground mb-2">
                  No products yet
                </h3>
                <p className="text-muted-foreground font-utility text-sm">
                  Products in this category will appear here.
                </p>
              </motion.div>
            )}
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-border/50 bg-card mt-8">
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
                <Smartphone className="w-3 h-3 text-primary" />
              </div>
              <span className="font-display font-bold text-sm text-foreground">
                PhoneHustle
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-utility text-center">
              <span className="font-semibold">Affiliate Disclosure:</span> This
              page contains affiliate links. I earn a small commission at no
              extra cost to you when you buy through my links.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-border/30 text-center">
            <p className="text-xs text-muted-foreground font-utility">
              © {currentYear}. Built with love using{" "}
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
        </div>
      </footer>
    </div>
  );
}
