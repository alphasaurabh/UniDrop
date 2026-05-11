"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ImagePlus, Loader2, Trash2, UploadCloud, WandSparkles } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  LISTING_CONDITIONS,
  LISTING_IMAGE_BUCKET,
  formatListingConditionLabel,
} from "@/features/marketplace/constants";
import type { Listing } from "@/features/marketplace/types";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type ListingFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  listing?: Listing;
  error?: string;
  categories?: { id: string; name: string }[];
};

type PreviewImage = {
  id: string;
  file: File;
  url: string;
  name: string;
  status: "queued" | "uploading" | "done" | "error";
};

type UploadedImagePayload = {
  image_url: string;
  display_order: number;
};

function PublishButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={pending}>
      {pending ? <Loader2 className="size-4 animate-spin" /> : <UploadCloud className="size-4" />}
      {pending ? "Publishing..." : isEditing ? "Save changes" : "Publish listing"}
    </Button>
  );
}

function isValidWhatsapp(value: string) {
  const normalized = value.replace(/[\s()-]/g, "");
  return /^\+?[0-9]{8,15}$/.test(normalized);
}

function getValidationMessage(formData: FormData, imageCount: number) {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const categoryId = String(formData.get("category_id") ?? "").trim();
  const condition = String(formData.get("condition") ?? "").trim();
  const price = Number(String(formData.get("price") ?? ""));
  const locationText = String(formData.get("location_text") ?? "").trim();
  const contactWhatsapp = String(formData.get("contact_whatsapp") ?? "").trim();

  if (title.length < 4) return "Use a clear product title with at least 4 characters.";
  if (title.length > 120) return "Keep the title within 120 characters.";
  if (description.length < 20) return "Add a description with at least 20 characters.";
  if (description.length > 5000) return "Keep the description within 5,000 characters.";
  if (!categoryId) return "Choose a category.";
  if (!LISTING_CONDITIONS.includes(condition as (typeof LISTING_CONDITIONS)[number])) {
    return `Choose one of: ${LISTING_CONDITIONS.map(formatListingConditionLabel).join(", ")}.`;
  }
  if (!Number.isFinite(price) || price < 0) return "Enter a valid price.";
  if (locationText.length < 2) return "Add your hostel or pickup location.";
  if (locationText.length > 120) return "Keep the location within 120 characters.";
  if (!isValidWhatsapp(contactWhatsapp)) return "Enter a valid WhatsApp number with country code.";
  if (imageCount === 0) return "Upload at least one product image.";
  return null;
}

export function ListingForm({ action, listing, error, categories }: ListingFormProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    listing?.category_id ?? categories?.[0]?.id ?? "",
  );
  const [selectedFiles, setSelectedFiles] = useState<PreviewImage[]>([]);
  const [removedImageIds, setRemovedImageIds] = useState<string[]>([]);
  const [localError, setLocalError] = useState<string | undefined>(error);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);
  const uploadedImagesRef = useRef<HTMLInputElement | null>(null);
  const allowNativeSubmitRef = useRef(false);
  const selectedFilesRef = useRef<PreviewImage[]>([]);

  const existingImages = useMemo(() => {
    return (listing?.images ?? []).filter((image) => !removedImageIds.includes(image.id));
  }, [listing?.images, removedImageIds]);

  const imageCount = existingImages.length + selectedFiles.length;

  useEffect(() => {
    setLocalError(error);
  }, [error]);

  useEffect(() => {
    selectedFilesRef.current = selectedFiles;
  }, [selectedFiles]);

  useEffect(() => {
    return () => {
      selectedFilesRef.current.forEach((image) => URL.revokeObjectURL(image.url));
    };
  }, []);

  function addFiles(files: File[]) {
    const availableSlots = Math.max(0, 8 - existingImages.length - selectedFiles.length);
    const newFiles = files.slice(0, availableSlots).map((file) => ({
      id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`,
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      status: "queued" as const,
    }));

    setSelectedFiles((current) => [...current, ...newFiles]);
    setLocalError(undefined);
  }

  function removeSelectedFile(id: string) {
    setSelectedFiles((current) => {
      const target = current.find((image) => image.id === id);
      if (target) {
        URL.revokeObjectURL(target.url);
      }
      return current.filter((image) => image.id !== id);
    });
  }

  function updateSelectedStatus(id: string, status: PreviewImage["status"]) {
    setSelectedFiles((current) =>
      current.map((image) => (image.id === id ? { ...image, status } : image)),
    );
  }

  async function uploadSelectedFiles() {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Your session expired. Please log in again.");
    }

    const draftId = crypto.randomUUID();
    const uploadedImages: UploadedImagePayload[] = [];

    for (const [index, image] of selectedFiles.entries()) {
      updateSelectedStatus(image.id, "uploading");

      const extension = image.file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${user.id}/${draftId}/${crypto.randomUUID()}.${extension}`;
      const { error } = await supabase.storage.from(LISTING_IMAGE_BUCKET).upload(path, image.file, {
        contentType: image.file.type || "image/jpeg",
        upsert: false,
      });

      if (error) {
        updateSelectedStatus(image.id, "error");
        throw new Error(error.message);
      }

      const { data } = supabase.storage.from(LISTING_IMAGE_BUCKET).getPublicUrl(path);
      uploadedImages.push({ image_url: data.publicUrl, display_order: index });
      updateSelectedStatus(image.id, "done");
    }

    return uploadedImages;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    if (allowNativeSubmitRef.current) {
      allowNativeSubmitRef.current = false;
      return;
    }

    event.preventDefault();
    setLocalError(undefined);

    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.set("category_id", selectedCategoryId);

    const validationMessage = getValidationMessage(formData, existingImages.length + selectedFiles.length);
    if (validationMessage) {
      setLocalError(validationMessage);
      return;
    }

    try {
      setIsUploading(true);
      const uploadedImages = await uploadSelectedFiles();

      if (uploadedImages.length === 0 && existingImages.length === 0) {
        throw new Error("Upload at least one product image.");
      }

      if (uploadedImagesRef.current) {
        uploadedImagesRef.current.value = JSON.stringify(uploadedImages);
      }

      allowNativeSubmitRef.current = true;
      form.requestSubmit();
    } catch (submitError) {
      setLocalError(submitError instanceof Error ? submitError.message : "UniDrop could not upload your images.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <motion.form
      ref={formRef}
      onSubmit={handleSubmit}
      className="grid gap-6 lg:grid-cols-[1fr_360px]"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      action={action}
    >
      <input ref={uploadedImagesRef} name="uploaded_images" type="hidden" defaultValue="[]" />
      <input name="removedImageIds" type="hidden" value={removedImageIds.join(",")} />

      <div className="space-y-6">
        {localError ? (
          <p className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {localError}
          </p>
        ) : null}

        <section className="surface-panel p-5 sm:p-7">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-xl font-semibold tracking-tight">Product photos</h2>
              <p className="mt-1 text-sm text-muted-foreground">Upload up to 8 clear images.</p>
            </div>
            <span className="text-sm text-muted-foreground">{imageCount}/8</span>
          </div>

          <div
            className={cn(
              "rounded-[1rem] border border-dashed border-border/70 bg-background/65 p-3 transition",
              dragActive && "border-primary bg-primary/5",
            )}
            onDragOver={(event) => {
              event.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(event) => {
              event.preventDefault();
              setDragActive(false);
              addFiles(Array.from(event.dataTransfer.files ?? []));
            }}
          >
            <label className="flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-[1rem] p-6 text-center transition hover:bg-muted/40">
              <ImagePlus className="size-8 text-primary" />
              <span className="mt-3 text-sm font-medium">Choose product images</span>
              <span className="mt-1 text-xs text-muted-foreground">PNG, JPG, WebP up to 5 MB each</span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                onChange={(event) => addFiles(Array.from(event.target.files ?? []))}
              />
            </label>
          </div>

          {selectedFiles.length > 0 || existingImages.length > 0 ? (
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {existingImages.map((image) => (
                <motion.div
                  key={image.id}
                  layout
                  className="relative overflow-hidden rounded-[1rem] border border-border/70 bg-muted/60"
                >
                  <Image
                    src={image.publicUrl}
                    alt={listing?.title ?? "Listing image"}
                    width={320}
                    height={240}
                    className="aspect-square w-full object-cover"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-2 grid size-8 place-items-center rounded-full bg-background/90 text-destructive shadow-soft"
                    onClick={() => setRemovedImageIds((ids) => [...ids, image.id])}
                    aria-label="Remove image"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </motion.div>
              ))}
              <AnimatePresence>
                {selectedFiles.map((preview) => (
                  <motion.div
                    key={preview.id}
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    className="relative overflow-hidden rounded-[1rem] border border-border/70 bg-muted/60"
                  >
                    <Image
                      src={preview.url}
                      alt={preview.name}
                      unoptimized
                      width={320}
                      height={320}
                      className="aspect-square w-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-black/55 via-transparent to-transparent p-3 text-xs text-white">
                      <span>
                        {preview.status === "uploading"
                          ? "Uploading..."
                          : preview.status === "done"
                            ? "Ready"
                            : preview.status === "error"
                              ? "Failed"
                              : "Queued"}
                      </span>
                      <button
                        type="button"
                        className="rounded-full bg-background/90 p-1.5 text-destructive shadow-soft"
                        onClick={() => removeSelectedFile(preview.id)}
                        aria-label="Remove selected image"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="mt-5 rounded-[1rem] border border-dashed border-border/70 bg-background/65 p-6 text-center text-sm text-muted-foreground">
              No photos yet. Add clear, well-lit images to make the listing stand out.
            </div>
          )}
        </section>

        <section className="surface-panel p-5 sm:p-7">
          <h2 className="font-display text-xl font-semibold tracking-tight">Listing details</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <label className="sm:col-span-2">
              <span className="mb-2 block text-sm font-medium">Product title</span>
              <Input
                name="title"
                defaultValue={listing?.title}
                placeholder="MacBook Air M1, engineering math book, cycle..."
                minLength={4}
                maxLength={120}
                required
              />
            </label>

            <label className="sm:col-span-2">
              <span className="mb-2 block text-sm font-medium">Category</span>
              <input name="category_id" type="hidden" value={selectedCategoryId} readOnly />
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {(categories ?? []).map((category) => {
                  const selected = category.id === selectedCategoryId;

                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => setSelectedCategoryId(category.id)}
                      className={cn(
                        "rounded-[1rem] border px-4 py-3 text-left text-sm transition",
                        selected
                          ? "border-primary bg-primary/10 text-primary shadow-soft"
                          : "border-border/70 bg-background/60 hover:border-primary/40 hover:bg-primary/5",
                      )}
                    >
                      <span className="block font-medium">{category.name}</span>
                      <span className="mt-1 block text-xs text-muted-foreground">
                        {selected ? "Selected" : "Tap to choose"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </label>

            <label>
              <span className="mb-2 block text-sm font-medium">Condition</span>
              <Select name="condition" defaultValue={listing?.condition ?? "good"} required>
                {LISTING_CONDITIONS.map((condition) => (
                  <option key={condition} value={condition}>
                    {formatListingConditionLabel(condition)}
                  </option>
                ))}
              </Select>
            </label>

            <label>
              <span className="mb-2 block text-sm font-medium">Price</span>
              <Input
                name="price"
                defaultValue={listing?.price}
                inputMode="numeric"
                min="0"
                type="number"
                placeholder="₹0"
                required
              />
            </label>

            <label className="flex h-12 items-center gap-3 self-end rounded-[1rem] border border-border/70 bg-background/75 px-4 text-sm font-medium shadow-soft">
              <input
                name="is_negotiable"
                type="checkbox"
                defaultChecked={listing?.is_negotiable ?? true}
                className="size-4 rounded border"
              />
              Negotiable
            </label>

            <label>
              <span className="mb-2 block text-sm font-medium">Hostel / location</span>
              <Input
                name="location_text"
                defaultValue={listing?.location_text}
                placeholder="Hostel C, Library gate..."
                minLength={2}
                maxLength={120}
                required
              />
            </label>

            <label>
              <span className="mb-2 block text-sm font-medium">WhatsApp contact</span>
              <Input
                name="contact_whatsapp"
                defaultValue={listing?.contact_whatsapp}
                placeholder="+91 98765 43210"
                required
              />
            </label>

            <label className="sm:col-span-2">
              <span className="mb-2 block text-sm font-medium">Description</span>
              <textarea
                name="description"
                defaultValue={listing?.description}
                maxLength={5000}
                className={cn(
                  "min-h-40 w-full rounded-[1rem] border border-border/70 bg-background/75 px-4 py-3 text-sm shadow-soft outline-none transition",
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
        <div className="surface-panel p-5">
          <h2 className="font-display text-lg font-semibold tracking-tight">Publish checklist</h2>
          <div className="mt-4 space-y-3 text-sm text-muted-foreground">
            <p>Use real photos taken on campus.</p>
            <p>Mark the price negotiable if you are open to offers.</p>
            <p>WhatsApp contact should be reachable for verified GBU students.</p>
          </div>
          {isUploading ? (
            <div className="mt-5 rounded-[1rem] border border-border/70 bg-muted/40 p-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2 text-foreground">
                <WandSparkles className="size-4 text-primary" />
                Uploading photos...
              </div>
              <p className="mt-2">Files upload first, then the listing is created.</p>
            </div>
          ) : null}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:flex-col">
            <PublishButton isEditing={Boolean(listing)} />
            <Button asChild href="/account" variant="outline" size="lg" className="w-full sm:w-auto">
              Cancel
            </Button>
          </div>
        </div>
      </aside>
      {/* Mobile sticky publish bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
        <div className="glass-nav pb-safe-bottom px-4 py-3">
          <div className="mx-auto max-w-3xl">
            <PublishButton isEditing={Boolean(listing)} />
          </div>
        </div>
      </div>
    </motion.form>
  );
}