import { PRICING_CONFIG } from "../constants";
import type { MemberData, MemberKey, RegisterRequest, TeamRegistrationData } from "../types";
import { cleanPhoneNumber } from "./validation";

export function getMemberKeys(formData: TeamRegistrationData): MemberKey[] {
  return formData.registrationType === "solo" ? ["member1"] : ["member1", "member2"];
}

export function getRegistrationAmount(formData: TeamRegistrationData): number {
  return getMemberKeys(formData).length * PRICING_CONFIG.feePerMember;
}

function prepareMember(member: MemberData): MemberData {
  return {
    ...member,
    phone: cleanPhoneNumber(member.phone),
    email: member.email.trim().toLowerCase(),
  };
}

export function buildRegisterPayload(formData: TeamRegistrationData): RegisterRequest {
  return {
    teamName: formData.teamName.trim(),
    member1: prepareMember(formData.member1),
    member2: formData.registrationType === "team" ? prepareMember(formData.member2) : null,
  };
}
