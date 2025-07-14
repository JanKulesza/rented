import Image from "next/image";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";
import { ClassValue } from "class-variance-authority/types";
import { useFormContext } from "react-hook-form";
import { FormMessage } from "../ui/form";
import { AspectRatio } from "../ui/aspect-ratio";

interface Props {
  className?: ClassValue;
  width?: number | string;
  height?: number | string;
  ratio?: number;
}

const DragZone = ({ className, width, height, ratio }: Props) => {
  const form = useFormContext();
  const [imageUpload, setImageUpload] = useState<string | null>(
    form.getValues("image")
      ? URL.createObjectURL(form.getValues("image"))
      : null
  );
  const [isDragging, setIsDragging] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageUpload(URL.createObjectURL(file));
      form.setValue("image", file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setImageUpload(URL.createObjectURL(file));
      form.setValue("image", file);
    }
  };

  return (
    <>
      <AspectRatio
        ratio={ratio ?? 16 / 9}
        style={{ width: width ?? "100%", height: height ?? "100%" }}
        className={cn(
          `rounded-2xl bg-muted/50 relative shadow-xs overflow-hidden border ${
            isDragging ? "border-primary bg-blue-50" : "border-input"
          }
          ${form.formState.errors.image && "border-destructive bg-red-50"}`,
          className
        )}
      >
        {imageUpload ? (
          <>
            <Image
              src={imageUpload}
              alt="preview"
              fill
              className="object-contain"
              unoptimized
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 hover:bg-muted/80"
              onClick={() => {
                setImageUpload(null);
                form.setValue("image", null);
              }}
            >
              <X />
            </Button>
          </>
        ) : (
          <>
            <Label
              htmlFor="image"
              className={`
                      h-full
                      text-muted-foreground
                      flex justify-center items-center
                      rounded-2xl
                      transition-colors duration-200 ease-in-out
                      ${isDragging && "text-primary"}
                      ${form.formState.errors.image && "text-destructive"}
                      cursor-pointer
                    `}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              Select Image
            </Label>
            <input
              name="image"
              id="image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </>
        )}
      </AspectRatio>
      {form.formState.errors.image?.message && (
        <FormMessage>
          {form.formState.errors.image.message.toString()}
        </FormMessage>
      )}
    </>
  );
};

export default DragZone;
