"use client";

import { ImagePlus, Loader2, Trash2, UploadCloud } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  CONTACT_PREFERENCES,
  LISTING_CATEGORIES,
  LISTING_CONDITIONS,
} from "@/features/marketplace/constants";
import type { Listing } from "@/features/marketplace/types";
import { cn } from "@/lib/utils";

type ListingFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  listing?: Listing;
  error?: string;
};

type PreviewImage = {
  id: string;
  url: string;
  name: string;
};

function PublishButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={pending}>
      {pending ? <Loader2 className="size-4 animate-spin" /> : <UploadCloud className="size-4" />}
      {pending ? "Saving..." : isEditing ? "Save changes" : "Publish listing"}
    </Button>
  );
}

export function ListingForm({ action, listing, error }: ListingFormProps) {
  const [previews, setPreviews] = useState<PreviewImage[]>([]);
  const [removedImageIds, setRemovedImageIds] = useState<string[]>([]);
  const existingImages = useMemo(() => {
    return (listing?.images ?? []).filter((image) => !removedImageIds.includes(image.id));
  }, [listing?.images, removedImageIds]);
  const imageCount = existingImages.length + previews.length;

  return (
    <form action={action} className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <input name="removedImageIds" type="hidden" value={removedImageIds.join(",")} />

      <div className="space-y-6">
        {error ? (
          <p className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </p>
        ) : null}

        <section className="rounded-3xl border bg-card/88 p-5 shadow-soft sm:p-7">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Product photos</h2>
              <p className="mt-1 text-sm text-muted-foreground">Upload up to 8 clear images.</p>
            </div>
            <span className="text-sm text-muted-foreground">{imageCount}/8</span>
          </div>

          <label className="flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed bg-muted/35 p-6 text-center transition hover:bg-muted/55">
            <ImagePlus className="size-8 text-primary" />
            <span className="mt-3 text-sm font-medium">Choose product images</span>
            <span className="mt-1 text-xs text-muted-foreground">PNG, JPG, WebP up to 5 MB each</span>
            <input
              name="images"
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              onChange={(event) => {
                const files = Array.from(event.target.files ?? []).slice(0, 8 - existingImages.length);
                setPreviews(
                  files.map((file) => ({
                    id: `${file.name}-${file.lastModified}`,
                    url: URL.createObjectURL(file),
                    name: file.name,
                  })),
                );
              }}
            />
          </label>

          {imageCount > 0 ? (
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {existingImages.map((image) => (
                <div key={image.id} className="relative overflow-hidden rounded-2xl border bg-muted">
                  <Image
                    src={image.publicUrl}
                    alt={listing?.title ?? "Listing image"}
                    width={320}
                    height={240}
                    className="aspect-square w-full object-cover"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-2 grid size-8 place-items-center rounded-full bg-white/90 text-destructive shadow-sm"
                    onClick={() => setRemovedImageIds((ids) => [...ids, image.id])}
                    aria-label="Remove image"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
              {previews.map((preview) => (
                <div key={preview.id} className="relative overflow-hidden rounded-2xl border bg-muted">
                  <Image
                    src={preview.url}
                    alt={preview.name}
                    width={320}
                    height={240}
                    className="aspect-square w-full object-cover"
                  />
                </div>
              ))}
            </div>
          ) : null}
        </section>

        <section className="rounded-3xl border bg-card/88 p-5 shadow-soft sm:p-7">
          <h2 className="text-xl font-semibold tracking-tight">Listing details</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <label className="sm:col-span-2">
              <span className="mb-2 block text-sm font-medium">Title</span>
              <Input name="title" defaultValue={listing?.title} placeholder="MacBook Air M2, cycle, books..." required />
            </label>
            <label>
              <span className="mb-2 block text-sm font-medium">Price</span>
              <Input name="price" defaultValue={listing?.price} inputMode="numeric" min="0" type="number" placeholder="₹0" required />
            </label>
            <label>
              <span className="mb-2 block text-sm font-medium">Condition</span>
              <Select name="condition" defaultValue={listing?.condition ?? "Like New"} required>
                {LISTING_CONDITIONS.map((condition) => (
                  <option key={condition}>{condition}</option>
                ))}
              </Select>
            </label>
            <label>
              <span className="mb-2 block text-sm font-medium">Category</span>
              <Select name="category" defaultValue={listing?.category ?? "Electronics"} required>
                {LISTING_CATEGORIES.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </Select>
            </label>
            <label>
              <span className="mb-2 block text-sm font-medium">Hostel / location</span>
              <Input name="location" defaultValue={listing?.location} placeholder="Hostel C, Library gate..." required />
            </label>
            <label>
              <span className="mb-2 block text-sm font-medium">Contact preference</span>
              <Select name="contactPreference" defaultValue={listing?.contact_preference ?? "Chat"} required>
                {CONTACT_PREFERENCES.map((preference) => (
                  <option key={preference}>{preference}</option>
                ))}
              </Select>
            </label>
            <label className="flex h-12 items-center gap-3 self-end rounded-2xl border bg-card/85 px-4 text-sm font-medium shadow-sm">
              <input
                name="negotiable"
                type="checkbox"
                defaultChecked={listing?.negotiable ?? true}
                className="size-4 rounded border"
              />
              Negotiable
            </label>
            <label className="sm:col-span-2">
              <span className="mb-2 block text-sm font-medium">Description</span>
              <textarea
                name="description"
                defaultValue={listing?.description}
                className={cn(
                  "min-h-40 w-full rounded-3xl border bg-card/85 px-4 py-3 text-sm shadow-sm outline-none transition",
                  "placeholder:text-muted-foreground/70 focus:ring-2 focus:ring-ring",
                )}
                placeholder="Mention condition, included accessories, pickup details, and anything buyers should know."
                required
              />
            </label>
          </div>
        </section>
      </div>

      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="rounded-3xl border bg-card/88 p-5 shadow-soft">
          <h2 className="text-lg font-semibold tracking-tight">Publish checklist</h2>
          <div className="mt-4 space-y-3 text-sm text-muted-foreground">
            <p>Use real photos taken on campus.</p>
            <p>Keep your price clear and mark it negotiable when flexible.</p>
            <p>Only verified GBU students can access and contact sellers.</p>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:flex-col">
            <PublishButton isEditing={Boolean(listing)} />
            <Button asChild href="/account" variant="outline" size="lg" className="w-full sm:w-auto">
              Cancel
            </Button>
          </div>
        </div>
      </aside>
    </form>
  );
}
