import React, { useState } from "react";
import { School } from "lucide-react";
import { MemberKey } from "../../types";
import { FormField } from "./FormField";
import styles from "../../register.module.css";

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

export function CollegeAutocomplete({ memberKey, value, suggestions, isTargetActive, error, onChange, onSelect, onFocus }: CollegeAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const showSuggestions = isOpen && isTargetActive && suggestions.length > 0;
  const listId = memberKey + "-college-suggestions";
  return (
    <div className={styles.autocomplete} onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) setIsOpen(false);
    }} onKeyDown={(event) => { if (event.key === "Escape") setIsOpen(false); }}>
      <FormField id={memberKey + "-college"} label="College / institution" placeholder="Search or enter your college" icon={<School size={15} />}
        autoComplete="off" value={value} error={error} aria-controls={showSuggestions ? listId : undefined}
        onChange={(e) => { setIsOpen(true); onChange(memberKey, e.target.value); }}
        onFocus={() => { setIsOpen(true); onFocus(memberKey); }} />
      {showSuggestions && <div id={listId} className={styles.suggestions} aria-label="College suggestions">
        {suggestions.map((college) => <button key={college} type="button" onClick={() => { onSelect(memberKey, college); setIsOpen(false); }}>{college}</button>)}
      </div>}
    </div>
  );
}
