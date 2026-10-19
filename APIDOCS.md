# DVINE Frontend Integration Guide

This guide is for the frontend engineer building the DVINE registration and payment flow. It details all screen states, TypeScript interfaces, pricing & discount rules, form validations, API calls, and Razorpay checkout modal handling.

---

## 1. Quick Setup & Environment

### Base URLs

- **Local Dev:** `http://127.0.0.1:8787`
- **Production:** `https://your-production-domain.com`

### Required External Scripts

Add Razorpay Checkout SDK to `index.html`:

```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

---

## 2. Key Business & Pricing Rules

| Rule                   | Details                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Capacity**           | **60 Total Seats** (counted per person across all individual and duo teams).                                                                                                                                                                                                                                                                                                                                                                         |
| **Registration Types** | **Individual (Solo)**: 1 person, optional team name.<br>**Duo (2 members)**: 2 persons, required team name.                                                                                                                                                                                                                                                                                                                                          |
| **Standard Pricing**   | **₹349 per person** (`price: 349`, `currency: "INR"`, `discountPerMember: 100`).<br>• Solo: ₹349<br>• Duo: ₹698                                                                                                                                                                                                                                                                                                                                      |
| **College Discount**   | **₹100 discount per eligible member** applied ONLY when **BOTH** are true:<br>1. Valid discount code (`JAIN100`, case-insensitive) entered for the team.<br>2. That member's own `collegeName` matches **"Jain University Kochi"** (case-insensitive, normalized for punctuation/spacing).<br>_Note: College alone without the code gives no discount. A valid code with non-Jain college is rejected._                                              |
| **Discount Capacity**  | Capped at the **first 10 discount slots** across the entire event (`discountSlotsRemaining`).<br>• Solo Jain + code: ₹249 (saves ₹100)<br>• Duo both Jain + code: ₹498 (saves ₹200, if 2 slots available; ₹598 if only 1 slot left)<br>• Duo 1 Jain + 1 other + code: ₹598 (saves ₹100 for the Jain member)<br>• Duo both non-Jain + code: Rejected (`DISCOUNT_NOT_APPLICABLE`)<br>• Any registration without code: Full price (Solo ₹349, Duo ₹698) |
| **Seat Hold (Lock)**   | **15 minutes** (`lockExpiresAt`). A temporary pending team holds the seat(s) while the user completes payment.                                                                                                                                                                                                                                                                                                                                       |
| **OTP Verification**   | Required for **Member 1 (Lead)** before submitting registration. Valid for 5 minutes.                                                                                                                                                                                                                                                                                                                                                                |

---

## 3. TypeScript Definitions (Copy-Paste Ready)

> **Food preference frontend extension:** The first registration step now requires
> a choice for each attendee and sends `foodPreference: "veg" | "non-veg"` inside
> `member1` and (for teams) `member2`. The API must accept and persist this field;
> backend storage support has not been verified from this frontend repository.

```typescript
// --- API Common ---
export interface ApiErrorResponse {
  error: string;
  message: string;
}

// --- Pricing Details (/payment/details) ---
export interface PaymentDetailsResponse {
  price: number; // 349 (base fee per member in INR)
  currency: string; // "INR"
  discountPerMember: number; // 100 (discount amount per eligible member in INR)
}

// --- Seat Availability (/register/get-av-seats) ---
export interface SeatStatusResponse {
  total: number; // 60 total seats
  registered: number; // Paid seats
  locked: number; // Seats currently locked in pending checkout
  available: number; // Remaining available seats (total - registered - locked)
  discountSlotsRemaining: number; // Remaining ₹100 discount slots out of 10
}

// --- Discount Code Validation (/register/discount/validate) ---
export interface ValidateDiscountRequest {
  code: string; // 1 to 32 characters, e.g. "JAIN100" (trimmed)
  collegeName: string; // 1 to 150 characters, e.g. "Jain University Kochi"
}

export interface ValidateDiscountResponse {
  valid: true;
  discountPerMember: number; // 100
  slotsRemaining: number; // Remaining discount slots out of 10
}

// --- OTP Flow ---
export interface SendOtpRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  code: string; // Exactly 6 digits
}

export interface VerifyOtpResponse {
  ok: true;
}

export interface IsEmailVerifiedResponse {
  verified: boolean;
}

// --- Registration Payload (/register) ---
export interface MemberData {
  firstName: string;
  lastName: string;
  gender: string; // e.g. "Male" | "Female" | "Other"
  foodPreference: "veg" | "non-veg";
  email: string;
  phone: string; // 10 digits, e.g. "9876543210"
  collegeName: string; // If "Jain University Kochi" AND discount code is valid, qualifies for ₹100 discount
  yearOfStudy: string; // e.g. "1st Year", "2nd Year", "3rd Year", "4th Year"
  department: string;
}

export interface RegisterRequest {
  teamName?: string; // Optional for solo (1 member); REQUIRED for duo (2 members)
  discountCode?: string; // Optional: discount coupon (e.g. "JAIN100", max 32 chars, normalized to uppercase)
  member1: MemberData; // Lead (email must match verified OTP)
  member2?: MemberData; // Optional: omit or leave undefined for solo registration
}

export interface RegisterSuccessResponse {
  teamId: string;
  amount: number; // Total payable amount in INR (e.g. 249, 349, 498, 598, 698)
  discountApplied: number; // Total discount in INR deducted from base fee (0, 100, or 200)
  currency: string; // "INR"
  orderId: string; // Razorpay order ID (e.g. "order_xyz123")
  keyId: string; // Razorpay public key ID
  lockExpiresAt: number; // Unix epoch timestamp (seconds) when seat reservation expires
}

// --- Paid Team & Member Details ---
export interface PaidTeamMember {
  id: string;
  slot: number; // 1 for lead, 2 for teammate
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  phone: string;
  collegeName: string;
  yearOfStudy: string;
  department: string;
  discountInr: number; // Discount received by this member (0 or 100)
  ticketHash: string; // 32-char hex string for QR code & ticket lookup
  checkedInAt: number | null;
}

export interface PaidTeamData {
  id: string;
  teamName: string | null; // null for solo registrations without a team name
  status: "paid";
  amountInr: number; // Amount paid in INR
  paidAt: number | null; // Unix timestamp (seconds)
  members: PaidTeamMember[];
}

// --- Payment Verification (/payment/verify) ---
export interface PaymentVerifyRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface PaymentVerifyResponse {
  ok: true;
  status: "paid";
  team?: PaidTeamData;
}

// --- Cancellation & Status Polling ---
export interface CancelRequest {
  teamId: string;
}

export interface CancelResponse {
  cancelled: boolean;
  reason?: "ALREADY_PAID" | "PAYMENT_IN_PROGRESS" | "CHECK_FAILED";
}

export interface TeamStatusResponse {
  status: "pending" | "paid" | "expired";
  lockExpiresAt?: number;
  team?: PaidTeamData;
}

// --- Public Ticket Fetch (/ticket/:hash) ---
export interface TicketDetailsResponse {
  ticketHash: string;
  status: "valid";
  checkedIn: boolean;
  checkedInAt: number | null;
  member: {
    slot: number;
    role: "lead" | "teammate";
    firstName: string;
    lastName: string;
    gender: string;
    email: string;
    phone: string;
    collegeName: string;
    yearOfStudy: string;
    department: string;
    discountInr: number;
  };
  team: {
    id: string;
    teamName: string | null;
    amountInr: number;
    paidAt: number | null;
  };
  event: {
    name: "DVINE";
    venue: "College of Engineering Chengannur";
  };
}
```

---

## 4. UI States & Step-by-Step Flow

```
[Screen 1: Landing & Seats] ── (Fetch pricing & available seats)
          │
          ▼
[Screen 2: Registration Mode & Lead OTP Verification]
          │ (Select Solo vs Duo; Lead OTP verified in KV)
          ▼
[Screen 3: Registration Details Form]
          │ (Solo: Member 1 only, optional team name)
          │ (Duo: Member 1 & 2, required team name)
          │ (POST /register -> seat locked for 15 mins)
          ▼
[Screen 4: Razorpay Checkout Modal]
    ┌─────┴────────────────────────┐
    ▼                              ▼
(Success)                  (Modal Dismissed)
    │                              │
POST /payment/verify        POST /register/cancel
    │                              ├─ cancelled: true  -> Back to Form / Seats freed
    ▼                              └─ PAYMENT_IN_PROGRESS -> Poll /register/status/:teamId
[Screen 5: Success Ticket]                                           │
                                                                     ▼
                                                          [Screen 5: Success Ticket]
```

---

### Step 1: Fetch Base Pricing & Seat Availability

#### A. Fetch Base Pricing

- **Endpoint:** `GET /payment/details`
- **Response:**
  ```json
  {
    "price": 349,
    "currency": "INR",
    "discountPerMember": 100
  }
  ```
- Use this to display standard registration fees dynamically (`₹349 / person`) and the available member discount (`₹100 / person`).

#### B. Fetch Available Seats & Discount Capacity

- **Endpoint:** `GET /register/get-av-seats`
- **Response:**
  ```json
  {
    "total": 60,
    "registered": 18,
    "locked": 2,
    "available": 40,
    "discountSlotsRemaining": 6
  }
  ```
- **UI Logic:**
  - If `available === 0`: Show **"Registrations are Sold Out"** banner and disable registration buttons.
  - If `available === 1`: Disable Duo registration (only Solo can fit the remaining seat).
  - Display seat counter: `"40 / 60 seats remaining"`.
  - Display discount promo badge:
    - If `discountSlotsRemaining > 0`: _"🔥 ₹100 discount per member available for the first 10 Jain University Kochi registrants with code JAIN100! (6 slots left)"_
    - If `discountSlotsRemaining === 0`: _"College discount slots have been fully claimed."_

---

### Step 2: Member 1 (Lead) Email OTP Verification

The lead member must verify their email before form submission.

1. **User enters Lead Email.**
2. **Send OTP:**
   - **Endpoint:** `POST /register/otp/send`
   - **Body:** `{ "email": "lead@example.com" }`
   - **Frontend UI Behavior:**
     - On `200`: Display 6-digit OTP input. Start a **60-second cooldown timer** on the "Resend OTP" button.
     - On `409` (`EMAIL_TAKEN`): Show error _"This email is already registered."_
     - On `429` (`COOLDOWN`): Show error _"Please wait 60 seconds before requesting another code."_
     - On `502` (`EMAIL_FAILED`): Show error _"Failed to send verification email. Please check your address."_
3. **Verify OTP:**
   - **Endpoint:** `POST /register/otp/verify`
   - **Body:** `{ "email": "lead@example.com", "code": "123456" }`
   - **Frontend UI Behavior:**
     - On `200`: Email verified. Lock the email input (read-only) and show a green verified checkmark. Proceed to Step 3.
     - On `400` (`INVALID_CODE`): Show error _"Incorrect verification code."_
     - On `400` (`CODE_EXPIRED`): Show error _"Code expired. Please request a new one."_
     - On `429` (`TOO_MANY_ATTEMPTS`): Show error _"Too many incorrect attempts (max 5). Please request a new code."_

> [!TIP]
> **Check Prior Verification:** You can also call `GET /register/is-email-verified?email=user@example.com` to see if a returning user's email was already verified within the last 5 minutes.

---

### Step 3: Registration Form & Client Validations

#### Registration Mode Toggle

Provide a toggle for the user to choose:

1. **Solo (Individual):** Only Member 1 fields shown. Team name is optional.
2. **Duo (2 Members):** Member 1 + Member 2 fields shown. Team name is required.

#### Form Validation Rules

| Field                   | Applicable To | Rule                                                                                                                   |
| ----------------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `teamName`              | Solo          | Optional. If provided, max 80 characters.                                                                              |
| `teamName`              | Duo           | **Required**. 1 to 80 characters (trimmed).                                                                            |
| `discountCode`          | Solo & Duo    | Optional. Up to 32 characters (trimmed). Empty or whitespace-only is treated as not provided. Normalized to uppercase. |
| `member1.email`         | Solo & Duo    | Read-only, locked to verified OTP email.                                                                               |
| `member2.email`         | Duo only      | Valid email, **must not match** `member1.email`.                                                                       |
| `phone`                 | All Members   | 10-digit Indian mobile format: `^[6-9]\d{9}$` (strip spaces, dashes, or `+91`).                                        |
| `firstName`, `lastName` | All Members   | Required, max 100 characters.                                                                                          |
| `collegeName`           | All Members   | Required, max 150 characters. Matches "Jain University Kochi" (case & punctuation insensitive).                        |
| `gender`                | All Members   | Dropdown (`Male`, `Female`, `Other`).                                                                                  |
| `yearOfStudy`           | All Members   | Dropdown/text (e.g., `1st Year`, `2nd Year`, `3rd Year`, `4th Year`).                                                  |
| `department`            | All Members   | Required, max 100 characters.                                                                                          |

#### Discount Code Validation ("Apply" Button Helper)

If the user enters a discount code and clicks **"Apply"**, call the advisory validation endpoint:

- **Endpoint:** `POST /register/discount/validate`
- **Body:**
  ```json
  {
    "code": "JAIN100",
    "collegeName": "Jain University Kochi"
  }
  ```
- **Responses:**
  - **`200 OK`**:
    ```json
    {
      "valid": true,
      "discountPerMember": 100,
      "slotsRemaining": 6
    }
    ```
    Show green confirmation badge: _"Coupon applied! ₹100 discount per eligible member."_
  - **`400 Bad Request` (`INVALID_DISCOUNT_CODE`)**: _"That discount code is not valid."_
  - **`400 Bad Request` (`DISCOUNT_NOT_APPLICABLE`)**: _"This code is only for Jain University Kochi students."_
  - **`409 Conflict` (`DISCOUNT_SOLD_OUT`)**: _"This discount is no longer available."_
  - **`429 Too Many Requests` (`RATE_LIMITED`)**: _"Too many attempts. Try again in a minute."_ (Guard allows 20 attempts/min per IP)

> [!NOTE]
> `/register/discount/validate` is advisory for instant UI feedback. The authoritative check is atomic inside `POST /register`.

#### Real-time Estimated Fee Indicator (Frontend UI Helper)

Before form submission, calculate and show the user the estimated fee:

- Base fee: `teamSize * 349`
- If a valid discount code (`JAIN100`) is entered AND `discountSlotsRemaining > 0`:
  - Deduct ₹100 for each member whose `collegeName` matches `"Jain University Kochi"` (e.g., "Jain University, Kochi", "jain university kochi").
  - _Example 1 (Solo, Jain + code):_ ₹349 - ₹100 = **₹249**
  - _Example 2 (Duo, both Jain + code):_ (2 × ₹349) - ₹200 = **₹498** (or ₹598 if only 1 slot left)
  - _Example 3 (Duo, 1 Jain + 1 non-Jain + code):_ (2 × ₹349) - ₹100 = **₹598**
  - _Example 4 (No code or non-Jain):_ Solo **₹349**, Duo **₹698**
- _Note:_ The backend atomically reserves remaining discount slots during the database transaction.

#### Submit Registration

- **Endpoint:** `POST /register`
- **Request Examples:**
  - **Solo:**
    ```json
    {
      "teamName": "SoloHacker",
      "discountCode": "JAIN100",
      "member1": {
        "firstName": "Alex",
        "lastName": "Kumar",
        "gender": "Male",
        "foodPreference": "veg",
        "email": "alex@example.com",
        "phone": "9876543210",
        "collegeName": "Jain University Kochi",
        "yearOfStudy": "3rd Year",
        "department": "CSE"
      }
    }
    ```
  - **Duo:**
    ```json
    {
      "teamName": "ByteBusters",
      "discountCode": "JAIN100",
      "member1": {
        "firstName": "Alex",
        "lastName": "Kumar",
        "gender": "Male",
        "foodPreference": "veg",
        "email": "alex@example.com",
        "phone": "9876543210",
        "collegeName": "Jain University Kochi",
        "yearOfStudy": "3rd Year",
        "department": "CSE"
      },
      "member2": {
        "firstName": "Sam",
        "lastName": "Varghese",
        "gender": "Female",
        "foodPreference": "non-veg",
        "email": "sam@example.com",
        "phone": "9876543211",
        "collegeName": "Jain University Kochi",
        "yearOfStudy": "3rd Year",
        "department": "ECE"
      }
    }
    ```

- **Handling Responses:**
  - **`201 Created`**:
    ```json
    {
      "teamId": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
      "amount": 498,
      "discountApplied": 200,
      "currency": "INR",
      "orderId": "order_ODZ123456",
      "keyId": "rzp_test_xxxx",
      "lockExpiresAt": 1776278400
    }
    ```

    - Launch **Razorpay Checkout Modal** (Step 4).
    - If `discountApplied > 0`, display a congratulatory notice: `₹${discountApplied} College Discount applied!`.
    - Start a 15-minute countdown timer matching `lockExpiresAt`.
  - **`400 Bad Request`**:
    - `INVALID_DISCOUNT_CODE`: _"That discount code is not valid."_
    - `DISCOUNT_NOT_APPLICABLE`: _"This code is only for Jain University Kochi students."_
  - **`403 Forbidden` (`EMAIL_NOT_VERIFIED`)**: Show _"Please verify the lead member's email first."_
  - **`409 Conflict`**:
    - `DISCOUNT_SOLD_OUT`: _"Discount slots are over. Remove the code to continue at the regular price."_
    - `SOLD_OUT`: _"Registrations just filled up. Seats are no longer available."_
    - `TEAM_NAME_TAKEN`: _"Team name already taken. Please choose another."_
    - `EMAIL_TAKEN`: _"One of these emails is already registered or currently in checkout."_
  - **`502 Bad Gateway` (`PAYMENT_INIT_FAILED`)**: _"Could not initialize payment gateway. Please retry."_
  - **`502 Bad Gateway` (`PAYMENT_INIT_FAILED`)**: _"Could not initialize payment gateway. Please retry."_

---

### Step 4: Razorpay Checkout Integration

Use the exact response from `POST /register` to launch the Razorpay Checkout modal:

```javascript
const options = {
  key: registerData.keyId,
  order_id: registerData.orderId,
  amount: registerData.amount * 100, // Amount in paise (e.g. 40000 paise = ₹400)
  currency: registerData.currency, // "INR"
  name: "DVINE",
  description: registerData.teamName
    ? `Registration for team: ${registerData.teamName}`
    : `Individual Registration - DVINE`,
  prefill: {
    name: `${formData.member1.firstName} ${formData.member1.lastName}`,
    email: formData.member1.email,
    contact: formData.member1.phone,
  },
  theme: {
    color: "#6366f1", // Match brand theme
  },

  // 1. Success Handler (Payment completed in modal)
  handler: async function (response) {
    try {
      // Call backend to verify signature & mark registration 'paid'
      const verifyRes = await fetch("http://127.0.0.1:8787/payment/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        }),
      });

      const verifyData = await verifyRes.json();

      if (verifyRes.ok && verifyData.status === "paid") {
        showSuccessScreen(verifyData.team || registerData.teamId);
      } else if (verifyRes.status === 410) {
        showError(
          "Your 15-minute reservation expired. Any debited amount will be refunded automatically.",
        );
      } else {
        showError(verifyData.message || "Payment verification failed.");
      }
    } catch (err) {
      showError(
        "Network error verifying payment. Our system will confirm your payment shortly.",
      );
    }
  },

  // 2. Dismiss Handler (User closed modal or exited)
  modal: {
    ondismiss: async function () {
      try {
        const cancelRes = await fetch("http://127.0.0.1:8787/register/cancel", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ teamId: registerData.teamId }),
        });

        const cancelData = await cancelRes.json();

        // Case A: Payment was in-flight (e.g. user approved UPI app while closing web tab)
        if (cancelData.reason === "PAYMENT_IN_PROGRESS") {
          showPendingProcessingScreen(registerData.teamId);
          return;
        }

        // Case B: Clean cancel -> Temporary seat lock was released
        showInfo(
          "Payment cancelled. Your temporary seat reservation has been released.",
        );
      } catch (e) {
        console.error("Cancel call error", e);
      }
    },
  },
};

const rzp = new window.Razorpay(options);
rzp.open();
```

---

### Step 5: Handling In-Flight Payments (Polling)

When `POST /register/cancel` returns `reason: "PAYMENT_IN_PROGRESS"`:

1. Show a loading screen: _"Confirming your payment with your bank... Please do not close this window."_
2. Poll `GET /register/status/:teamId` every 3 seconds for up to 90 seconds:

```typescript
async function pollPaymentStatus(teamId: string) {
  const maxAttempts = 30; // 30 * 3s = 90s
  let attempts = 0;

  const interval = setInterval(async () => {
    attempts++;
    try {
      const res = await fetch(
        `http://127.0.0.1:8787/register/status/${teamId}`,
      );
      const data: TeamStatusResponse = await res.json();

      if (data.status === "paid") {
        clearInterval(interval);
        showSuccessScreen(data.team || teamId);
      } else if (data.status === "expired" || attempts >= maxAttempts) {
        clearInterval(interval);
        showError(
          "Payment timed out or failed. If money was debited, it will be refunded automatically.",
        );
      }
    } catch (err) {
      console.error("Polling error", err);
    }
  }, 3000);
}
```

---

### Step 6: Rendering the Ticket & QR Code (`/ticket/:hash`)

When an attendee visits `https://www.dvine.live/ticket/:hash` (from the confirmation screen or email link):

1. **Fetch Ticket Details:**
   - **Endpoint:** `GET /ticket/:hash`
   - **Response:** `TicketDetailsResponse`
2. **Display Elements:**
   - **Registration Type / Team Name:**
     - If `ticket.team.teamName` is present: Display `Team: ${ticket.team.teamName}`
     - If `ticket.team.teamName` is `null`: Display `"Individual Registration"`
   - **Attendee Info:** Full name, college, year of study, department.
   - **Role:** `"Team Leader"` (slot 1) or `"Teammate"` (slot 2). For solo registrations, display `"Attendee"`.
   - **Payment Badge:** `"Paid (₹${ticket.team.amountInr})"` with discount badge if `ticket.member.discountInr > 0`.
   - **QR Code:** Render a QR code encoding `ticket.ticketHash` (scanned at the event entrance).
   - **Check-in Indicator:** If `checkedIn: true`, show green `"Checked In at <time>"`.

```tsx
import QRCode from "qrcode.react";

export function TicketView({ ticket }: { ticket: TicketDetailsResponse }) {
  const isSolo = ticket.team.teamName === null;
  const roleLabel = isSolo
    ? "Attendee"
    : ticket.member.role === "lead"
      ? "Team Leader"
      : "Teammate";

  return (
    <div className="ticket-card">
      <div className="ticket-header">
        <h2>{ticket.event.name} Ticket</h2>
        <span className="badge-paid">₹{ticket.team.amountInr} Paid</span>
      </div>

      <div className="ticket-meta">
        <p className="team-title">
          {ticket.team.teamName
            ? `Team: ${ticket.team.teamName}`
            : "Individual Registration"}
        </p>
        <p className="attendee-name">
          {ticket.member.firstName} {ticket.member.lastName}{" "}
          <span className="role-tag">({roleLabel})</span>
        </p>
        <p className="college-name">{ticket.member.collegeName}</p>
        <p className="department">
          {ticket.member.department} • {ticket.member.yearOfStudy}
        </p>

        {ticket.member.discountInr > 0 && (
          <span className="badge-discount">
            ₹{ticket.member.discountInr} College Discount Applied
          </span>
        )}
      </div>

      {/* QR Code scanned at event gate */}
      <div className="qr-container">
        <QRCode value={ticket.ticketHash} size={220} level="H" includeMargin />
      </div>

      {ticket.checkedIn ? (
        <div className="status-checked-in">
          ✓ Checked in at{" "}
          {new Date(ticket.checkedInAt! * 1000).toLocaleTimeString()}
        </div>
      ) : (
        <p className="ticket-footer">
          Show this QR code at the entrance check-in.
        </p>
      )}
    </div>
  );
}
```

---

## 5. Complete Error Codes Reference

All error responses from the API return HTTP status `>= 400` with the format:

```json
{
  "error": "ERROR_CODE",
  "message": "Human readable explanation."
}
```

| HTTP Status | Error Code                | Recommended User-Facing Notification                                                        |
| ----------- | ------------------------- | ------------------------------------------------------------------------------------------- |
| `400`       | `INVALID_CODE`            | "Invalid OTP code. Please check and re-enter."                                              |
| `400`       | `CODE_EXPIRED`            | "Verification code has expired. Request a new one."                                         |
| `400`       | `INVALID_DISCOUNT_CODE`   | "That discount code is not valid."                                                          |
| `400`       | `DISCOUNT_NOT_APPLICABLE` | "This code is only for Jain University Kochi students."                                     |
| `400`       | `BAD_SIGNATURE`           | "Payment security verification failed. Please contact support."                             |
| `403`       | `EMAIL_NOT_VERIFIED`      | "Please verify the lead member's email before registering."                                 |
| `404`       | `TICKET_NOT_FOUND`        | "Ticket not found or registration payment is pending."                                      |
| `409`       | `DISCOUNT_SOLD_OUT`       | "Discount slots are over. Remove the code to continue at the regular price."                |
| `409`       | `SOLD_OUT`                | "Registrations are now full. No seats remaining."                                           |
| `409`       | `TEAM_NAME_TAKEN`         | "This team name is already taken. Please choose a different name."                          |
| `409`       | `EMAIL_TAKEN`             | "One of the provided email addresses is already registered or in checkout."                 |
| `410`       | `LOCK_EXPIRED`            | "Your 15-minute seat reservation expired. Deducted payment will be automatically refunded." |
| `429`       | `RATE_LIMITED`            | "Too many attempts. Try again in a minute."                                                 |
| `429`       | `COOLDOWN`                | "Please wait 60 seconds before requesting another verification code."                       |
| `429`       | `TOO_MANY_ATTEMPTS`       | "Maximum OTP attempts exceeded (5 max). Please request a new code."                         |
| `502`       | `EMAIL_FAILED`            | "Unable to send verification email. Please check the address or try again."                 |
| `502`       | `PAYMENT_INIT_FAILED`     | "Could not connect to payment gateway. Please try again."                                   |
