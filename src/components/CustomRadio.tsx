import { cn } from "./ui/utils";

interface CustomRadioProps {
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  id: string;
  children: React.ReactNode;
  className?: string;
}

export function CustomRadio({ value, checked, onChange, id, children, className }: CustomRadioProps) {
  return (
    <div 
      className={cn(
        "flex items-center space-x-3 p-3 rounded-lg border cursor-pointer group transition-all duration-200",
        checked 
          ? "border-brand-primary bg-brand-primary/5" 
          : "border-neutral-300 hover:border-brand-primary/50 hover:bg-brand-primary/5",
        className
      )}
      onClick={() => onChange(value)}
    >
      {/* Custom Radio Circle */}
      <div className="relative flex-shrink-0">
        <div 
          className={cn(
            "w-5 h-5 rounded-full border transition-all duration-200",
            checked 
              ? "border-brand-primary bg-white" 
              : "border-neutral-400 bg-white hover:border-brand-primary/70"
          )}
        >
          {/* Inner dot when checked */}
          {checked && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-brand-primary rounded-full" />
          )}
        </div>
      </div>
      
      {/* Label content */}
      <label 
        htmlFor={id} 
        className={cn(
          "cursor-pointer flex-1 leading-relaxed transition-colors text-sm",
          checked ? "text-brand-primary" : "group-hover:text-brand-primary"
        )}
      >
        {children}
      </label>
    </div>
  );
}