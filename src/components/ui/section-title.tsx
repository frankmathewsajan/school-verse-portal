
import { cn } from "@/lib/utils";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export function SectionTitle({ 
  title, 
  subtitle, 
  centered = false, 
  className 
}: SectionTitleProps) {
  return (
    <div className={cn(
      "space-y-2 mb-8",
      centered && "text-center",
      className
    )}>
      <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h2>
      {subtitle && (
        <p className="text-muted-foreground max-w-[80ch]">
          {subtitle}
        </p>
      )}
    </div>
  );
}
