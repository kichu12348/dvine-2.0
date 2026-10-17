import { DISCOUNT_COLLEGE_NAME, PRICING_CONFIG } from "../constants";
import type { MemberData, MemberKey, RegisterRequest, TeamRegistrationData } from "../types";
import { cleanPhoneNumber } from "./validation";

export function getMemberKeys(formData: TeamRegistrationData): MemberKey[] {
  return formData.registrationType === "solo" ? ["member1"] : ["member1", "member2"];
}

export function normalizeCollege(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function isDiscountCollege(collegeName: string): boolean {
  return normalizeCollege(collegeName) === normalizeCollege(DISCOUNT_COLLEGE_NAME);
}

export function getEligibleMemberCount(formData: TeamRegistrationData): number {
  const keys = getMemberKeys(formData);
  return keys.filter((key) => isDiscountCollege(formData[key].collegeName)).length;
}

export function getDiscountEstimate(
  formData: TeamRegistrationData,
  discount?: { applied: boolean; perMember: number; slotsRemaining: number | null }
): number {
  if (!discount?.applied) return 0;
  const eligibleCount = getEligibleMemberCount(formData);
  const slots = discount.slotsRemaining ?? Infinity;
  const discounted = Math.max(0, Math.min(eligibleCount, slots));
  return discounted * discount.perMember;
}

export function getRegistrationAmount(
  formData: TeamRegistrationData,
  basePrice: number = PRICING_CONFIG.feePerMember,
  discount?: { applied: boolean; perMember: number; slotsRemaining: number | null }
): number {
  const memberCount = getMemberKeys(formData).length;
  const base = memberCount * basePrice;
  const discountAmount = getDiscountEstimate(formData, discount);
  return Math.max(0, base - discountAmount);
}

function prepareMember(member: MemberData): MemberData {
  return {
    ...member,
    phone: cleanPhoneNumber(member.phone),
    email: member.email.trim().toLowerCase(),
  };
}

export function buildRegisterPayload(formData: TeamRegistrationData): RegisterRequest {
  const trimmedTeam = formData.teamName.trim();
  const payload: RegisterRequest = {
    member1: prepareMember(formData.member1),
  };

  if (trimmedTeam) {
    payload.teamName = trimmedTeam;
  }

  const trimmedDiscount = formData.discountCode?.trim();
  if (trimmedDiscount) {
    payload.discountCode = trimmedDiscount;
  }

  if (formData.registrationType === "team") {
    payload.member2 = prepareMember(formData.member2);
  }

  return payload;
}
