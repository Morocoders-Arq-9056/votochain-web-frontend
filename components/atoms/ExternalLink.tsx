import { cn } from "@/lib/utils";

type ExternalLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
};

export function ExternalLink({ className, children, ...props }: ExternalLinkProps) {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "text-base font-semibold text-brand-primary underline-offset-4 hover:underline focus-visible:outline-2",
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
}
