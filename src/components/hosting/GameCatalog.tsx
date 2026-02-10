import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Filter, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { GameCard } from "./GameCard";
import { gameServers, gameCategories, gameSortOptions, GameServer } from "@/data/gameServersData";
import { useGameServers } from "@/hooks/useGameServers";

export function GameCatalog() {
  const { t } = useTranslation();
  const { games: dbGames, loading: dbLoading } = useGameServers();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [showFilters, setShowFilters] = useState(false);

  // Merge DB games (published) with static data — DB takes priority by slug
  const allGames: GameServer[] = useMemo(() => {
    const dbPublished = dbGames.filter(g => g.is_published);
    const dbMapped: GameServer[] = dbPublished.map(g => ({
      id: g.slug,
      slug: g.slug,
      title: g.title,
      coverImage: g.cover_image_url || "",
      pricingDisplay: g.pricing_display,
      priceValue: Number(g.price_value),
      pricingUnit: g.pricing_unit as any,
      shortDescription: g.short_description,
      fullDescription: g.full_description,
      tags: g.tags || [],
      category: g.category as any,
      os: g.os as any,
      popular: g.popular,
      features: g.features || [],
      plans: g.plans || [],
      faqs: g.faqs || [],
      heroPoints: g.hero_points || [],
    }));

    // Add static games that are NOT in DB (by slug)
    const dbSlugs = new Set(dbMapped.map(g => g.slug));
    const staticOnly = gameServers.filter(g => !dbSlugs.has(g.slug));

    return [...dbMapped, ...staticOnly];
  }, [dbGames]);

  const filteredAndSortedGames = useMemo(() => {
    let result = [...allGames];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (game) =>
          game.title.toLowerCase().includes(query) ||
          game.shortDescription.toLowerCase().includes(query) ||
          game.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      result = result.filter((game) => game.category === selectedCategory);
    }

    // Sort
    switch (sortBy) {
      case "popular":
        result.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
        break;
      case "price-asc":
        result.sort((a, b) => a.priceValue - b.priceValue);
        break;
      case "price-desc":
        result.sort((a, b) => b.priceValue - a.priceValue);
        break;
      case "name-asc":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "name-desc":
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
    }

    return result;
  }, [searchQuery, selectedCategory, sortBy]);

  // Translated category labels
  const translatedCategories = gameCategories.map((cat) => ({
    ...cat,
    label: t(`categories.${cat.id}`),
  }));

  // Translated sort options
  const translatedSortOptions = [
    { id: "popular", label: t("common.popular") },
    { id: "price-asc", label: t("common.priceLowHigh") },
    { id: "price-desc", label: t("common.priceHighLow") },
    { id: "name-asc", label: t("common.nameAZ") },
    { id: "name-desc", label: t("common.nameZA") },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder={t("common.searchGame")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all text-lg"
            />
          </div>
        </motion.div>

        {/* Filters Row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap items-center justify-between gap-4 mb-8"
        >
          {/* Category Pills - Desktop */}
          <div className="hidden md:flex items-center gap-2">
            {translatedCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center gap-2 px-4 py-2 rounded-lg bg-muted text-foreground"
          >
            <Filter className="w-4 h-4" />
            {t("nav.filters")}
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
          </button>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none px-4 py-2 pr-10 rounded-lg bg-muted text-foreground border border-border focus:outline-none focus:border-primary/50 cursor-pointer"
            >
              {translatedSortOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
        </motion.div>

        {/* Mobile Filters Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden flex flex-wrap gap-2 mb-6"
          >
            {translatedCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {category.label}
              </button>
            ))}
          </motion.div>
        )}

        {/* Results Count */}
        <p className="text-sm text-muted-foreground mb-6">
          {t("common.gamesFound", { count: filteredAndSortedGames.length })}
        </p>

        {/* Game Grid */}
        {filteredAndSortedGames.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedGames.map((game, index) => (
              <GameCard key={game.id} game={game} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground mb-4">{t("common.noResults")}</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="text-primary hover:underline"
            >
              {t("buttons.clearFilters")}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
