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

| Rule                   | Details                                                                                                                                                                                                                                                                                                   |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Capacity**           | **60 Total Seats** (counted per person across all individual and duo teams).                                                                                                                                                                                                                              |
| **Registration Types** | **Individual (Solo)**: 1 person, optional team name.<br>**Duo (2 members)**: 2 persons, required team name.                                                                                                                                                                                               |
| **Standard Pricing**   | **₹300 per person** (`price: 300`, `currency: "INR"`).<br>• Solo: ₹300<br>• Duo: ₹600                                                                                                                                                                                                                     |
| **College Discount**   | **₹100 discount per eligible member** for students from **"College of Engineering Chengannur"** (case-insensitive).                                                                                                                                                                                       |
| **Discount Capacity**  | Capped at the **first 10 discount slots** across the entire event (`discountSlotsRemaining`).<br>• Solo CEC: ₹200 (saves ₹100)<br>• Duo both CEC: ₹400 (saves ₹200, if 2 slots available; ₹500 if only 1 slot left)<br>• Duo 1 CEC + 1 other: ₹500 (saves ₹100)<br>• Duo both non-CEC: ₹600 (no discount) |
| **Seat Hold (Lock)**   | **15 minutes** (`lockExpiresAt`). A temporary pending team holds the seat(s) while the user completes payment.                                                                                                                                                                                            |
| **OTP Verification**   | Required for **Member 1 (Lead)** before submitting registration. Valid for 5 minutes.                                                                                                                                                                                                                     |

---

## 3. TypeScript Definitions (Copy-Paste Ready)

```typescript
// --- API Common ---
export interface ApiErrorResponse {
  error: string;
  message: string;
}

// --- Pricing Details (/payment/details) ---
export interface PaymentDetailsResponse {
  price: number; // 300 (base fee per member in INR)
  currency: string; // "INR"
}

// --- Seat Availability (/register/get-av-seats) ---
export interface SeatStatusResponse {
  total: number; // 60 total seats
  registered: number; // Paid seats
  locked: number; // Seats currently locked in pending checkout
  available: number; // Remaining available seats (total - registered - locked)
  discountSlotsRemaining: number; // Remaining ₹100 discount slots out of 10
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
  email: string;
  phone: string; // 10 digits, e.g. "9876543210"
  collegeName: string; // If "College of Engineering Chengannur", qualifies for ₹100 discount
  yearOfStudy: string; // e.g. "1st Year", "2nd Year", "3rd Year", "4th Year"
  department: string;
}

export interface RegisterRequest {
  teamName?: string; // Optional for solo (1 member); REQUIRED for duo (2 members)
  member1: MemberData; // Lead (email must match verified OTP)
  member2?: MemberData; // Optional: omit or leave undefined for solo registration
}

export interface RegisterSuccessResponse {
  teamId: string;
  amount: number; // Total payable amount in INR (e.g. 200, 300, 400, 500, 600)
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
  { "price": 300, "currency": "INR" }
  ```
- Use this to display standard registration fees dynamically (`₹300 / person`).

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
    - If `discountSlotsRemaining > 0`: _"🔥 ₹100 discount available for the first 10 CEC registrants! (6 slots left)"_
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

| Field                   | Applicable To | Rule                                                                            |
| ----------------------- | ------------- | ------------------------------------------------------------------------------- |
| `teamName`              | Solo          | Optional. If provided, max 80 characters.                                       |
| `teamName`              | Duo           | **Required**. 1 to 80 characters (trimmed).                                     |
| `member1.email`         | Solo & Duo    | Read-only, locked to verified OTP email.                                        |
| `member2.email`         | Duo only      | Valid email, **must not match** `member1.email`.                                |
| `phone`                 | All Members   | 10-digit Indian mobile format: `^[6-9]\d{9}$` (strip spaces, dashes, or `+91`). |
| `firstName`, `lastName` | All Members   | Required, max 100 characters.                                                   |
| `collegeName`           | All Members   | Required, max 150 characters.                                                   |
| `gender`                | All Members   | Dropdown (`Male`, `Female`, `Other`).                                           |
| `yearOfStudy`           | All Members   | Dropdown/text (e.g., `1st Year`, `2nd Year`, `3rd Year`, `4th Year`).           |
| `department`            | All Members   | Required, max 100 characters.                                                   |

#### Real-time Estimated Fee Indicator (Frontend UI Helper)

Before form submission, calculate and show the user the estimated fee:

- Base fee: `teamSize * 300`
- If college matches `"college of engineering chengannur"` (case-insensitive) and `discountSlotsRemaining > 0`:
  - Subtract ₹100 per eligible member.
- _Note:_ The backend atomically verifies remaining discount slots at checkout.

#### Submit Registration

- **Endpoint:** `POST /register`
- **Request Examples:**
  - **Solo:**
    ```json
    {
      "teamName": "SoloHacker",
      "member1": {
        "firstName": "Alex",
        "lastName": "Kumar",
        "gender": "Male",
        "email": "alex@example.com",
        "phone": "9876543210",
        "collegeName": "College of Engineering Chengannur",
        "yearOfStudy": "3rd Year",
        "department": "CSE"
      }
    }
    ```
  - **Duo:**
    ```json
    {
      "teamName": "ByteBusters",
      "member1": {
        "firstName": "Alex",
        "lastName": "Kumar",
        "gender": "Male",
        "email": "alex@example.com",
        "phone": "9876543210",
        "collegeName": "College of Engineering Chengannur",
        "yearOfStudy": "3rd Year",
        "department": "CSE"
      },
      "member2": {
        "firstName": "Sam",
        "lastName": "Varghese",
        "gender": "Female",
        "email": "sam@example.com",
        "phone": "9876543211",
        "collegeName": "College of Engineering Chengannur",
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
      "amount": 400,
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
  - **`403 Forbidden` (`EMAIL_NOT_VERIFIED`)**: Show _"Please verify the lead member's email first."_
  - **`409 Conflict`**:
    - `SOLD_OUT`: _"Registrations just filled up. Seats are no longer available."_
    - `TEAM_NAME_TAKEN`: _"Team name already taken. Please choose another."_
    - `EMAIL_TAKEN`: _"One of these emails is already registered or currently in checkout."_
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

| HTTP Status | Error Code            | Recommended User-Facing Notification                                                        |
| ----------- | --------------------- | ------------------------------------------------------------------------------------------- |
| `400`       | `INVALID_CODE`        | "Invalid OTP code. Please check and re-enter."                                              |
| `400`       | `CODE_EXPIRED`        | "Verification code has expired. Request a new one."                                         |
| `400`       | `BAD_SIGNATURE`       | "Payment security verification failed. Please contact support."                             |
| `403`       | `EMAIL_NOT_VERIFIED`  | "Please verify the lead member's email before registering."                                 |
| `404`       | `TICKET_NOT_FOUND`    | "Ticket not found or registration payment is pending."                                      |
| `409`       | `SOLD_OUT`            | "Registrations are now full. No seats remaining."                                           |
| `409`       | `TEAM_NAME_TAKEN`     | "This team name is already taken. Please choose a different name."                          |
| `409`       | `EMAIL_TAKEN`         | "One of the provided email addresses is already registered or in checkout."                 |
| `410`       | `LOCK_EXPIRED`        | "Your 15-minute seat reservation expired. Deducted payment will be automatically refunded." |
| `429`       | `COOLDOWN`            | "Please wait 60 seconds before requesting another verification code."                       |
| `429`       | `TOO_MANY_ATTEMPTS`   | "Maximum OTP attempts exceeded (5 max). Please request a new code."                         |
| `502`       | `EMAIL_FAILED`        | "Unable to send verification email. Please check the address or try again."                 |
| `502`       | `PAYMENT_INIT_FAILED` | "Could not connect to payment gateway. Please try again."                                   |
