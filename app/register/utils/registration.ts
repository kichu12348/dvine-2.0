import { PRICING_CONFIG } from "../constants";
import type { MemberData, MemberKey, RegisterRequest, TeamRegistrationData } from "../types";
import { cleanPhoneNumber } from "./validation";

export function getMemberKeys(formData: TeamRegistrationData): MemberKey[] {
  return formData.registrationType === "solo" ? ["member1"] : ["member1", "member2"];
}

/** @deprecated Discounts have been removed. Always returns 0. */
export function getDiscountEstimate(
  _formData?: TeamRegistrationData,
  _discountSlotsRemaining?: number
): number {
  return 0;
}

export function getRegistrationAmount(
  formData: TeamRegistrationData,
  basePrice: number = PRICING_CONFIG.feePerMember,
  _discountSlotsRemaining?: number
): number {
  const memberCount = getMemberKeys(formData).length;
  return memberCount * basePrice;
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

  if (formData.registrationType === "team") {
    payload.member2 = prepareMember(formData.member2);
  }

  return payload;
}
