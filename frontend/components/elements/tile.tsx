import React from "react";
import { Button } from "../ui/button";
import { LucideProps } from "lucide-react";
import Image from "next/image";

interface TilePropsBase extends React.ComponentProps<"button"> {
  label: string;
  info?: string;
  active?: boolean;
}

type TileProps =
  | (TilePropsBase & {
      icon: React.ForwardRefExoticComponent<
        Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
      >;
      src?: null;
      alt?: null;
    })
  | (TilePropsBase & { icon?: null; src: string; alt: string });

const Tile = (props: TileProps) => {
  const iconOrImage = (size: number) =>
    props.icon ? (
      <props.icon style={{ height: size, width: size }} />
    ) : (
      <Image
        alt={props.alt}
        src={props.src}
        height={size + 12}
        width={size + 12}
        className="rounded-full"
      />
    );
  return (
    <Button
      variant="outline"
      className={`flex ${
        !props.info
          ? "flex-col items-baseline"
          : "flex-row-reverse items-center justify-between"
      } p-3 min-h-24 h-auto min-w-48 hover:border-primary hover:text-primary transition-colors duration-300 ${
        props.active ? "border-primary text-primary" : ""
      }`}
      {...props}
    >
      {props.info ? (
        <>
          {iconOrImage(36)}
          <div className="flex flex-col items-baseline max-w-2/3">
            <span className="font-semibold lg:text-lg">{props.label}</span>
            <span className="text-muted-foreground text-wrap max-lg:text-xs text-left">
              {props.info}
            </span>
          </div>
        </>
      ) : (
        <>
          {iconOrImage(24)}
          <span className="font-semibold text-[1rem]">{props.label}</span>
        </>
      )}
    </Button>
  );
};

export default Tile;
