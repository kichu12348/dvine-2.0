import { useState } from "react";
import { School } from "lucide-react";
import { MemberKey } from "../../types";
import { FormField } from "./FormField";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "../../../components/ui/popover";

export interface CollegeAutocompleteProps {
  memberKey: MemberKey;
  value: string;
  suggestions: string[];
  isTargetActive: boolean;
  error?: string;
  onChange: (memberKey: MemberKey, val: string) => void;
  onSelect: (memberKey: MemberKey, college: string) => void;
  onFocus: (memberKey: MemberKey) => void;
}

export function CollegeAutocomplete({
  memberKey,
  value,
  suggestions,
  isTargetActive,
  error,
  onChange,
  onSelect,
  onFocus,
}: CollegeAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const showSuggestions = isOpen && isTargetActive && suggestions.length > 0;
  const listId = `${memberKey}-college-suggestions`;

  return (
    <Popover open={showSuggestions} onOpenChange={setIsOpen}>
      <PopoverAnchor asChild>
        <div className="relative w-full">
          <FormField
            id={`${memberKey}-college`}
            label="College / institution"
            placeholder="Search or enter your college"
            icon={<School size={15} />}
            autoComplete="off"
            value={value}
            error={error}
            aria-controls={showSuggestions ? listId : undefined}
            aria-expanded={showSuggestions}
            onChange={(e) => {
              setIsOpen(true);
              onChange(memberKey, e.target.value);
            }}
            onFocus={() => {
              setIsOpen(true);
              onFocus(memberKey);
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setIsOpen(false);
              }
            }}
          />
        </div>
      </PopoverAnchor>
      <PopoverContent
        id={listId}
        role="listbox"
        aria-label="College suggestions"
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
        className="w-[var(--radix-popover-anchor-width)] max-h-[260px] overflow-y-auto p-1.5"
        sideOffset={6}
        style={{
          scrollbarColor: "var(--muted) transparent",
        }}
      >
        {suggestions.map((college) => (
          <button
            key={college}
            type="button"
            role="option"
            aria-selected={value === college}
            className="flex min-h-[48px] w-full items-center rounded-[6px] px-3.5 py-2 text-left text-[14px] text-[#c5d9e9] outline-none transition-colors duration-120 hover:bg-[#1b2d3e] hover:text-[#a6dfff] focus:bg-[#1b2d3e] focus:text-[#a6dfff]"
            onMouseDown={(e) => {
              // Prevent blur before click executes
              e.preventDefault();
            }}
            onClick={() => {
              onSelect(memberKey, college);
              setIsOpen(false);
            }}
          >
            {college}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}
