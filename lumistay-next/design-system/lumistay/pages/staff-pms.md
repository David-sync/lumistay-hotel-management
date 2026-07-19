# Staff PMS Override — Single Property

This page-level system overrides `../MASTER.md` for every route under `src/app/(app)` and the login route.

## Product model

LumiStay staff UI is a single-property hotel PMS/front-desk workspace. It is not a SaaS analytics dashboard or multi-property administration platform.

## Visual direction

- Mood: calm, dependable, operational, compact.
- App background: `#F4F1EB`; panel: `#FBFAF7`; secondary panel: `#F0EDE7`.
- Primary: deep hotel green `#183B35`; accent: brass `#9A6A2F`.
- Text: `#17211E`; secondary `#716B61`; border `#D8D2C7`.
- UI type: Source Sans 3. IDs/tabular data: IBM Plex Mono.
- Base UI: 13–14px. Controls: 32–36px. Table rows: 44–52px.
- Radius: 4px controls, 6px panels. No card hover lift. Minimal shadows.

## Workflow hierarchy

1. Hôm nay: arrivals, in-house, departures, unpaid folios, exceptions.
2. Sơ đồ phòng: compact rack by floor; occupancy and housekeeping remain separate signals.
3. Đặt phòng: searchable reservation worklist and one contextual action per row.
4. Thu ngân: folios, payment, checkout.
5. Supporting records: customers, services, reports, staff, settings.

## Do not use

- Bento/KPI card dashboards, generic trend pills, glassmorphism, gradients.
- Procedure maps, SQL table names, environment badges, technical audit labels in normal staff UI.
- `Ops`, `Console`, SaaS captions, decorative English eyebrows.
- Large room cards with price and instructional prose; the rack is a scan surface.
- Excessive rounded pills or status colors without fixed operational meaning.
