---
title: Architecture Overview
doc_type: architecture
status: draft
owners: ["@julian-cardone"]
last_reviewed: 2026-06-03
related: ["docs/adrs/0001-documentation-structure.md", "docs/adrs/0005-frontend-technologies.md"]
tags: [architecture]
---

# Architecture Overview

This document captures the product shape and the current state of the application as it is built.

## Product Summary

Placecard is a mobile app (iOS and Android) that matches users through shared real-world plans.
Users link a verified plan — a restaurant reservation, event ticket, or social gathering — and the
app surfaces compatible people who want to join. The initial launch is scoped to New York City.

## Current Implementation

The mobile app lives in `app/` (Expo / React Native, per
[ADR-0005](../adrs/0005-frontend-technologies.md)). The frontend foundation and the first
user-facing flow are in place:

- **Design tokens** — `app/src/styles/tokens.ts` holds the brand palette, spacing, radii, Nunito
  typography, and per-platform shadows. Components reference tokens rather than hardcoding values.
- **Shared UI primitives** — `app/src/components/ui/` (`Wordmark`, `Button`), domain-agnostic and
  exposed through a public surface.
- **Onboarding feature** — `app/src/features/onboarding/` owns the entry flow: a Splash brand
  moment, a phone-entry screen, and a placeholder code-verification screen.
- **Navigation** — `app/src/navigation/RootNavigator.tsx` is a React Navigation native stack (Splash
  → Phone Entry → Verify), mounted by `app/App.tsx` after the Nunito fonts load.

Authentication (real SMS code delivery and verification) and the main five-tab app are not yet
built; the Verify screen is a placeholder pending the auth backend.
