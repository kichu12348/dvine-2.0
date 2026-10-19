import React from "react";
import { Pencil } from "lucide-react";
import { MemberData } from "../../types";
import { FOOD_OPTIONS } from "../../constants";
import styles from "../../register.module.css";

export interface MemberReviewCardProps {
  title: string;
  icon: React.ReactNode;
  memberData: MemberData;
  onEdit: () => void;
}

export function MemberReviewCard({ title, icon, memberData, onEdit }: MemberReviewCardProps) {
  const details = [
    ["Full name", memberData.firstName + " " + memberData.lastName],
    ["Gender", memberData.gender],
    ["Food preference", FOOD_OPTIONS.find((option) => option.value === memberData.foodPreference)?.label ?? "—"],
    ["Email address", memberData.email],
    ["Phone number", "+91 " + memberData.phone],
    ["Institution", memberData.collegeName],
    ["Year & department", memberData.yearOfStudy + " · " + memberData.department],
  ];
  return (
    <section className={styles.memberCard}>
      <div className={styles.reviewHeader}>
        <h3>{icon}{title}</h3>
        <button type="button" onClick={onEdit} className={styles.editButton} aria-label={"Edit " + title.toLowerCase() + " details"}><Pencil size={11} aria-hidden="true" /> Edit</button>
      </div>
      <dl className={styles.reviewDetails}>{details.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
    </section>
  );
}
