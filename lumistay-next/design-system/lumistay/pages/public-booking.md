# Public Booking Override — Single Property

This page-level system overrides `../MASTER.md` for every route under `src/app/(public)`.

## Product model

LumiStay is one hotel property selling its own inventory directly. It is not a marketplace, OTA, travel agency, or hotel onboarding SaaS.

## Visual direction

- Mood: quiet boutique hospitality, warm, grounded, editorial but readable.
- Background: warm ivory `#F4F0E8`; surface `#FBF9F5`; border `#D5CEC2`.
- Primary: deep hotel green `#183B35`; hover `#102F2A`.
- Accent: restrained brass `#9A6A2F`; never use it as a large background.
- Text: ink `#25241F`; muted `#6C685F`.
- Display type: Newsreader. UI/body: Source Sans 3.
- Corners: 0–4px. Use borders before shadows.
- Motion: 150–250ms color/border/image transitions only.

## Information architecture

- Search asks for check-in, check-out, and guests only.
- Results are grouped by room type, not exposed as a marketplace list of physical rooms.
- Physical room assignment remains internal until confirmation.
- Homepage order: property promise → direct search → story → rooms → amenities → location/direct-booking reassurance.
- Policies and total pricing appear before confirmation.

## Do not use

- Booking.com blue/yellow or marketplace copy.
- Fake scarcity, destination search, hotel comparison, partner onboarding.
- Glassmorphism, gradients, bento cards, giant SaaS headings, excessive pills.
- SQL/procedure/database language in guest-facing content.
