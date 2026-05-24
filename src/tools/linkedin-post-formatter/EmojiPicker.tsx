"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Briefcase,
  Coffee,
  Flag,
  Hand,
  Hash,
  Heart,
  Laptop,
  Leaf,
  PartyPopper,
  PawPrint,
  Plane,
  Search,
  Smile,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";

import { EMOJI_CATEGORIES, searchEmojis } from "@/tools/linkedin-post-formatter/emoji-data";
import { cn } from "@/lib/utils";

const PANEL_WIDTH = 360;
const PANEL_HEIGHT = 400;

/** Outline icons for category tabs (WhatsApp-style), distinct from full-color grid emojis. */
const CATEGORY_TAB_ICONS: Record<string, LucideIcon> = {
  smileys: Smile,
  gestures: Hand,
  hearts: Heart,
  work: Briefcase,
  tech: Laptop,
  celebrate: PartyPopper,
  nature: Leaf,
  animals: PawPrint,
  food: Coffee,
  travel: Plane,
  symbols: Hash,
  flags: Flag,
};

function CategoryTabIcon({ categoryId, selected }: { categoryId: string; selected: boolean }) {
  const Icon = CATEGORY_TAB_ICONS[categoryId] ?? Users;

  return (
    <Icon
      className={cn(
        "h-[1.125rem] w-[1.125rem] shrink-0",
        selected ? "stroke-[2.25]" : "stroke-[1.75]",
      )}
      aria-hidden
    />
  );
}

type EmojiPickerProps = {
  onSelect: (emoji: string) => void;
};

export function EmojiPicker({ onSelect }: EmojiPickerProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const searchId = useId();

  const [open, setOpen] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState(EMOJI_CATEGORIES[0]?.id ?? "smileys");
  const [searchQuery, setSearchQuery] = useState("");
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const isSearching = searchQuery.trim().length > 0;
  const searchResults = isSearching ? searchEmojis(searchQuery) : [];
  const activeCategory = EMOJI_CATEGORIES.find((category) => category.id === activeCategoryId);
  const visibleEmojis = isSearching ? searchResults : (activeCategory?.emojis ?? []);

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) {
      return;
    }

    const rect = trigger.getBoundingClientRect();
    const margin = 12;
    let left = rect.left;
    let top = rect.bottom + 8;

    if (left + PANEL_WIDTH > window.innerWidth - margin) {
      left = window.innerWidth - PANEL_WIDTH - margin;
    }

    if (left < margin) {
      left = margin;
    }

    if (top + PANEL_HEIGHT > window.innerHeight - margin) {
      top = Math.max(margin, rect.top - PANEL_HEIGHT - 8);
    }

    setPosition({ top, left });
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setSearchQuery("");
  }, []);

  const openPicker = useCallback(() => {
    setOpen(true);
    updatePosition();
  }, [updatePosition]);

  const handleSelect = useCallback(
    (emoji: string) => {
      onSelect(emoji);
      close();
      triggerRef.current?.focus();
    },
    [close, onSelect],
  );

  useLayoutEffect(() => {
    if (!open) {
      return;
    }

    updatePosition();
    const frame = requestAnimationFrame(() => searchRef.current?.focus());

    const onResize = () => updatePosition();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, true);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize, true);
    };
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
        triggerRef.current?.focus();
      }
    };

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (triggerRef.current?.contains(target) || panelRef.current?.contains(target)) {
        return;
      }

      close();
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
    };
  }, [close, open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    listRef.current?.scrollTo({ top: 0 });
  }, [activeCategoryId, isSearching, open]);

  const panel = open ? (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Emoji picker"
      className="border-border bg-card fixed z-[100] flex flex-col overflow-hidden rounded-2xl border shadow-[var(--shadow)]"
      style={{
        top: position.top,
        left: position.left,
        width: PANEL_WIDTH,
        maxHeight: PANEL_HEIGHT,
      }}
    >
      <div className="border-border flex items-center gap-2 border-b px-3 py-2.5">
        <Search className="text-muted-foreground h-4 w-4 shrink-0" aria-hidden />
        <input
          ref={searchRef}
          id={searchId}
          type="search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search emojis..."
          autoComplete="off"
          className="text-foreground placeholder:text-muted-foreground min-w-0 flex-1 bg-transparent text-sm outline-none"
        />
        {searchQuery ? (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => setSearchQuery("")}
            className="text-muted-foreground hover:text-foreground cursor-pointer rounded-md p-1"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      {!isSearching ? (
        <div
          className="emoji-picker-categories border-border flex gap-0.5 overflow-x-auto border-b px-1.5 py-1"
          role="tablist"
          aria-label="Emoji categories"
        >
          {EMOJI_CATEGORIES.map((category) => {
            const selected = category.id === activeCategoryId;

            return (
              <button
                key={category.id}
                type="button"
                role="tab"
                aria-selected={selected}
                title={category.label}
                onClick={() => setActiveCategoryId(category.id)}
                className={cn(
                  "emoji-picker-category-tab relative flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg transition-colors",
                  selected
                    ? "emoji-picker-category-tab--active text-primary"
                    : "text-muted-foreground hover:bg-background-soft hover:text-foreground",
                )}
              >
                <span className="sr-only">{category.label}</span>
                <CategoryTabIcon categoryId={category.id} selected={selected} />
              </button>
            );
          })}
        </div>
      ) : null}

      <div className="border-border border-b px-3 py-1.5">
        <p className="text-muted-foreground text-xs font-medium">
          {isSearching
            ? searchResults.length > 0
              ? `${searchResults.length} result${searchResults.length === 1 ? "" : "s"}`
              : "No emojis found"
            : activeCategory?.label}
        </p>
      </div>

      <div ref={listRef} className="min-h-0 flex-1 overflow-y-auto p-2">
        {visibleEmojis.length > 0 ? (
          <div className="emoji-picker-grid grid grid-cols-8 gap-0.5">
            {visibleEmojis.map((entry, index) => (
              <button
                key={`${entry.emoji}-${index}`}
                type="button"
                title={entry.keywords.join(", ")}
                onClick={() => handleSelect(entry.emoji)}
                className="emoji-picker-grid-item hover:bg-background-soft focus-visible:ring-primary flex h-9 w-full cursor-pointer items-center justify-center rounded-lg text-[1.35rem] leading-none focus-visible:ring-2 focus-visible:outline-none"
              >
                {entry.emoji}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground px-2 py-8 text-center text-sm">
            {isSearching
              ? "Try another keyword, like coffee or rocket."
              : "No emojis in this category."}
          </p>
        )}
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        title="Insert emoji"
        aria-label="Insert emoji"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => (open ? close() : openPicker())}
        className={cn(
          "border-border bg-background-soft text-foreground hover:border-border-strong hover:bg-background inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-xl border px-2.5 transition-colors",
          open && "border-primary bg-primary-soft text-primary",
        )}
      >
        <Smile className="h-4 w-4" strokeWidth={2.25} aria-hidden />
        <span className="text-sm font-medium">Emoji</span>
      </button>

      {typeof document !== "undefined" && panel ? createPortal(panel, document.body) : null}
    </>
  );
}
