# Elektr-Âme Membership Structure

## 🎯 Overview

Elektr-Âme operates a **yearly-based membership system** with 4 tiers designed to accommodate different levels of support for Barcelona's electronic music community.

---

## 💳 Membership Tiers

### 1. **FREE** (€0/year) 🆓
- **Access:** Limited
- **Benefits:**
  - Newsletter subscription
  - Ability to upgrade/renew membership
  - Community updates
- **Best for:** Those exploring the community
- **Card Color:** Gray gradient

### 2. **BASIC** (€40/year) 💙
- **Access:** Full membership
- **Benefits:**
  - All free benefits
  - Member events access
  - Digital membership card
  - Discount at partner venues
  - Member directory access
  - Workshops and classes
  - Voting rights
- **Best for:** Active community members
- **Card Color:** Blue gradient
- **Renewal:** Every 12 months

### 3. **SPONSOR** (>€40/year) 🌟
- **Access:** Full membership + Tax benefits
- **Benefits:**
  - All basic benefits
  - **Tax deduction on contribution** (Spanish tax law RDL 6/2023)
  - Recognition as sponsor
  - Tax receipt provided
  - Priority event access
  - Sponsor newsletter
- **Best for:** Those wanting to support more and get tax benefits
- **Card Color:** Purple gradient
- **Tax Deduction:**
  - 80% on first €250
  - 40% on amount above €250
  - 45% if recurring 3+ consecutive years

### 4. **LIFETIME** (One-time payment) 🏆
- **Access:** Permanent membership
- **Benefits:**
  - All basic benefits (forever!)
  - No annual renewal needed
  - Lifetime member badge
  - Special recognition
  - Priority support
- **Best for:** Long-term supporters
- **Card Color:** Gold gradient
- **Price:** TBD (suggested €500)

---

## 💰 Pricing Examples

### Basic Membership
```
€40/year
No tax deduction
Net cost: €40
```

### Sponsor Examples

#### **€50 Sponsor**
```
Contribution: €50
Tax deduction: €40 (80% of €50)
Net cost: €10
Effective discount: 80%
```

#### **€100 Sponsor**
```
Contribution: €100
Tax deduction: €80 (80% of €100)
Net cost: €20
Effective discount: 80%
```

#### **€250 Sponsor**
```
Contribution: €250
Tax deduction: €200 (80% of €250)
Net cost: €50
Effective discount: 80%
```

#### **€300 Sponsor**
```
Contribution: €300
Tax deduction:
  - First €250 × 80% = €200
  - Remaining €50 × 40% = €20
  - Total: €220
Net cost: €80
Effective discount: 73.3%
```

#### **€500 Sponsor**
```
Contribution: €500
Tax deduction:
  - First €250 × 80% = €200
  - Remaining €250 × 40% = €100
  - Total: €300
Net cost: €200
Effective discount: 60%
```

#### **€1,000 Sponsor**
```
Contribution: €1,000
Tax deduction:
  - First €250 × 80% = €200
  - Remaining €750 × 40% = €300
  - Total: €500
Net cost: €500
Effective discount: 50%
```

---

## 📜 Tax Deduction Law (Spain)

**Real Decreto-ley 6/2023** (Effective January 1, 2024)

### Individual Donors (IRPF)
- **First €250:** 80% deduction
- **Above €250:** 40% deduction (standard)
- **Above €250:** 45% deduction (if recurring 3+ years)

### Requirements for Tax Deduction
1. Elektr-Âme must be registered as eligible entity
2. Member must have Spanish tax residency
3. Tax receipt must be provided
4. Valid for IRPF declaration

### Tax Receipt Contents
- Association name and CIF
- Donor name and member ID
- Amount donated
- Date and fiscal year
- Tax deduction breakdown
- Official stamp/signature

---

## 🎨 Digital Membership Cards

Each tier has a distinctive gradient color:

| Tier | Color | Gradient |
|------|-------|----------|
| **Free** | Gray | `from-gray-600 to-gray-800` |
| **Basic** | Blue | `from-blue-600 to-blue-800` |
| **Sponsor** | Purple | `from-purple-600 to-purple-800` |
| **Lifetime** | Gold | `from-yellow-600 to-yellow-800` |

All cards include:
- Member name and ID (format: EA-000001)
- QR code for venue scanning
- Membership type and status
- Valid from/until dates
- Artist name (if applicable)

---

## 🔄 Renewal Process

### Basic & Sponsor Members
- **Frequency:** Annual (every 12 months)
- **Reminder:** 30 days before expiry
- **Grace Period:** TBD
- **Method:** Online payment (when bank account ready)

### Renewal Notification
Members receive:
1. Email reminder 30 days before expiry
2. Portal notification
3. Visual alert in member portal
4. Option to upgrade tier during renewal

### Lifetime Members
- No renewal needed
- Membership never expires
- Can make additional donations anytime

---

## 📊 Database Structure

### Membership Fields
```sql
membership_type ENUM('free', 'basic', 'sponsor', 'lifetime')
membership_start_date DATE
membership_end_date DATE
payment_status ENUM('unpaid', 'paid', 'overdue')
payment_amount DECIMAL(10, 2)
tax_deductible BOOLEAN
tax_receipt_sent BOOLEAN
tax_receipt_date DATE
```

---

## 🚀 Member Journey

### New Member Registration
1. Fill out "Join Us" form
2. Choose membership tier (or start free)
3. Payment (if applicable)
4. Email confirmation
5. Access to member portal
6. Digital card available

### Upgrading from Free to Basic/Sponsor
1. Login to member portal
2. Click "Upgrade Membership"
3. Choose tier and make payment
4. Updated card issued immediately
5. Tax receipt sent (if sponsor)

### Renewing Membership
1. Renewal reminder 30 days before expiry
2. Login to member portal
3. Click "Renew Membership"
4. Confirm/upgrade tier
5. Make payment
6. New expiry date applied

---

## 💡 Benefits Comparison

| Feature | Free | Basic | Sponsor | Lifetime |
|---------|------|-------|---------|----------|
| Newsletter | ✅ | ✅ | ✅ | ✅ |
| Member Portal | ✅ | ✅ | ✅ | ✅ |
| Digital Card | ❌ | ✅ | ✅ | ✅ |
| Events Access | ❌ | ✅ | ✅ | ✅ |
| Partner Discounts | ❌ | ✅ | ✅ | ✅ |
| Workshops | ❌ | ✅ | ✅ | ✅ |
| Voting Rights | ❌ | ✅ | ✅ | ✅ |
| Tax Deduction | ❌ | ❌ | ✅ | ❌ |
| Tax Receipt | ❌ | ❌ | ✅ | ❌ |
| Renewal | Yearly | Yearly | Yearly | Never |
| Cost/Year | €0 | €40 | >€40 | One-time |

---

## 📈 Recommended Sponsor Levels

To make it easy for sponsors, we suggest these amounts:

### **€50 - Supporter** ⭐
- Net cost: €10 (after €40 tax back)
- Perfect for active supporters

### **€100 - Bronze Sponsor** 🥉
- Net cost: €20 (after €80 tax back)
- Recognition as bronze sponsor

### **€250 - Silver Sponsor** 🥈
- Net cost: €50 (after €200 tax back)
- Recognition as silver sponsor
- Maximum 80% deduction rate

### **€500 - Gold Sponsor** 🥇
- Net cost: €200 (after €300 tax back)
- Recognition as gold sponsor
- Priority event access

### **€1,000 - Platinum Sponsor** 💎
- Net cost: €500 (after €500 tax back)
- Recognition as platinum sponsor
- Special acknowledgment

---

## 🔐 Access Control

### Free Members
- Portal: View only
- Newsletter: Subscribe
- Events: Cannot register
- Benefits: None

### Basic Members
- Portal: Full access
- Events: Full access
- Benefits: All standard benefits
- Card: Yes

### Sponsor Members
- Portal: Full access
- Events: Priority access
- Benefits: All + tax deduction
- Card: Yes (purple)
- Receipt: Automatic

### Lifetime Members
- Portal: Full access
- Events: Permanent access
- Benefits: All standard benefits
- Card: Yes (gold)
- Special: Never expires

---

## 📝 Notes for Implementation

### Required for Go-Live
1. Bank account setup ✅ (Pending Spanish NIF)
2. Payment gateway integration ⏳
3. Tax entity registration ⏳
4. Tax receipt generation ✅ (Code ready)

### Future Enhancements
- Automatic renewal reminders
- Payment gateway integration (Stripe/PayPal/Redsys)
- Automatic tax receipt generation
- Member tier comparison page
- Sponsor recognition wall
- Recurring payment option
- Apple/Google Wallet integration

---

## 🎉 Marketing Messages

### For Basic Members
> **€40/year = Full Access**
> Join Barcelona's electronic music community. Get your digital membership card, access to all events, partner discounts, and voting rights!

### For Sponsors
> **Support Music, Save on Taxes!**
> Contribute €100, get €80 back from taxes. Your net cost: only €20! 
> Full membership + tax benefits + recognition as sponsor.

### For Lifetime
> **One Payment, Lifetime Access**
> Never renew again. Join once, member forever.
> Perfect for long-term supporters of Barcelona's electronic music scene.

---

## 📞 Contact

For membership questions:
- Email: membership@elektr-ame.com
- Portal: https://www.elektr-ame.com/member-portal
- Admin: https://www.elektr-ame.com/admin

---

**Last Updated:** October 8, 2025
**Version:** 2.0 (Yearly-based structure)

