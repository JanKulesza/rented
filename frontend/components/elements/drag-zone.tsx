import Image from "next/image";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";
import { ClassValue } from "class-variance-authority/types";
import { useFormContext } from "react-hook-form";
import { FormMessage } from "../ui/form";

interface Props {
  className?: ClassValue;
  width?: number | string;
  height?: number | string;
}

const DragZone = ({ className, width, height }: Props) => {
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
      <div
        style={{ width: width ?? "100%", height: height ?? "100%" }}
        className={cn("rounded-2xl relative shadow overflow-hidden", className)}
      >
        {imageUpload ? (
          <>
            <Image
              src={imageUpload}
              alt="preview"
              fill
              className="object-cover "
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
                      flex justify-center items-center
                      border-1 rounded-2xl
                      transition-colors duration-200 ease-in-out
                      ${
                        isDragging
                          ? "border-primary text-primary bg-blue-50"
                          : "border-gray-300"
                      }
                      ${
                        form.formState.errors.image
                          ? "border-destructive text-destructive bg-red-50"
                          : ""
                      }
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
      </div>
      {form.formState.errors.image?.message && (
        <FormMessage>
          {form.formState.errors.image.message.toString()}
        </FormMessage>
      )}
    </>
  );
};

export default DragZone;
