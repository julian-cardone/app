---
title: "ADR-0005: Frontend Framework, Dev Toolchain, and Navigation"
doc_type: adr
status: accepted
owners: ["@julian-cardone"]
last_reviewed: 2026-06-02
related: []
tags: [frontend, mobile, react-native, expo, navigation]
---

# ADR-0005: Frontend Framework, Dev Toolchain, and Navigation

## Context

Placecard is a mobile-first social app targeting iOS and Android. The engineering team has an
existing React JS background but no prior React Native experience.

The decision covers three tightly coupled choices:

- **UI framework**: what technology renders the mobile app.
- **Dev toolchain**: how the app is built, run, and previewed during development.
- **Navigation**: how screens, tabs, and modals are managed at runtime.

These choices are foundational — they shape every screen, component, and developer workflow from day
one. Reversing any of them later would require a near-total rewrite.

**Constraints:**

- Small team with no dedicated mobile engineers.
- React JS familiarity; no prior React Native experience.
- V1 is NYC invite-only beta — no need to optimize for scale or distribution complexity yet.
- iOS- and Android-specific native build tooling (Xcode, Android Studio) is explicitly out of scope
  for the initial development phase.

**Alternatives considered:**

- **Flutter**: strong cross-platform story, but requires learning Dart and abandons the team's
  existing React and JavaScript knowledge entirely. Rejected.
- **Ionic / Capacitor**: web-based; renders in a WebView rather than native components. Acceptable
  for some use cases but produces a noticeably less native feel for gesture-heavy UIs like swipe
  stacks and tab navigation. Rejected.
- **Bare React Native (without Expo)**: gives full control over native code but requires Xcode and
  Android Studio from day one, adding significant setup overhead and platform-specific complexity
  before any product work is done. Deferred — this is the likely path for production builds but is
  not appropriate for the current phase.
- **React Navigation alternatives (React Native Navigation by Wix)**: closer to native navigation
  primitives but requires native build tooling and is more complex to configure. Not compatible with
  Expo Go. Rejected for V1.

## Decision

**React Native** is the UI framework for the Placecard mobile app.

**Expo (managed workflow via Expo Go)** is the development toolchain for the current phase. Expo Go
— a companion app installed on a physical device — serves as the primary live preview environment.
This eliminates the need for Xcode or Android Studio during active development. Native build tooling
will be introduced when App Store and Play Store distribution becomes necessary.

**React Navigation** is the navigation library. It handles the five-tab bottom navigation (Discover,
Explore, Add a Plan, Messages, Profile), stack navigators for screen-level transitions, and modal
presentation. React Navigation is the de facto standard in the React Native ecosystem and is fully
compatible with Expo Go.

Styling uses React Native's built-in `StyleSheet` API. No third-party CSS or styling library is
introduced unless a concrete gap is identified.

## Consequences

### Positives

- React JS knowledge transfers directly — components, hooks, props, and state work identically. The
  learning surface is limited to React Native's rendering primitives and layout model.
- Expo Go enables instant live preview on a real physical device via QR code, with hot reload. No
  Xcode, no Android Studio, no emulator setup required.
- React Navigation is mature, well-documented, and widely used. Solutions to common problems are
  readily available.
- `StyleSheet` is sufficient for V1 and keeps the dependency surface small.
- Expo's managed workflow handles native dependencies, OTA updates, and build configuration
  automatically for the current phase.

### Negatives

- Expo Go imposes constraints on which native modules can be used. Any feature requiring a native
  module not included in Expo's managed runtime will require ejecting to a bare workflow or using
  Expo's EAS Build service.
- `StyleSheet` has meaningful differences from CSS: no cascade, no shorthand properties, no
  `position: fixed`, and split shadow APIs across iOS and Android. These require adjustment.
- Ejecting from Expo's managed workflow later — when App Store distribution is needed — will require
  native build tooling setup at that point.
- React Navigation adds abstraction over native navigation; in edge cases, behavior may not match
  platform-native navigation exactly.

### Out of Scope

- Native build configuration (Xcode, Android Studio, EAS Build) is not addressed by this ADR.
- App Store and Play Store distribution strategy is not addressed by this ADR.
- The decision of whether to eject from Expo's managed workflow for production builds is not made
  here.
- Third-party styling libraries (e.g., NativeWind, Tamagui) are not evaluated here. If `StyleSheet`
  proves insufficient, a separate ADR should be written.
- Web support via React Native Web is not in scope for V1.

## Notes

Expo Go is appropriate for the current development phase. When the team is ready to target
production distribution, the path forward is Expo's EAS Build service or a full eject to a bare
React Native workflow — both are well-supported migration paths. That decision should be captured in
a separate ADR at that time.
