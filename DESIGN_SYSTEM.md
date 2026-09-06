# Koda Design System

## Brand Direction

Koda is designed as a **calm, editorial career workspace** rather than a
conventional job-board or corporate HR dashboard.

The visual language should feel:

-   Professional
-   Focused
-   Warm
-   Quiet
-   Modern
-   Human
-   Purposeful

Avoid visual patterns that make Koda look like an AI assistant, social
network, recruitment marketplace, or generic productivity SaaS.

## Logo Usage

### Primary logo

Use:

`assets/images/koda-logo.png`

Prefer placing the logo on light or neutral surfaces when the artwork
contains dark typography or transparent areas.

### App icon

Use:

`assets/images/icon.png`

The app icon should remain visually simple and recognizable at small
sizes.

## Color Tokens

``` text
navy   #14212D
slate  #2C4051
brown  #816445
gold   #C89B5E
paper  #E0D4C2
white  #FFFFFF
```

### Usage

**Navy** - Primary headings - Primary buttons - Navigation emphasis -
High-contrast surfaces

**Slate** - Secondary text - Supporting labels - Secondary UI elements

**Brown** - Warm supporting accents - Secondary emphasis

**Gold** - Important interactive accents - Active states - Progress
emphasis

**Paper** - Soft surfaces - Background accents - Supporting containers

**White** - Main application canvas - Forms - Cards and clean content
areas

## Typography

Primary family: **Poppins**

Use typography to establish hierarchy before adding decorative elements.

Recommended hierarchy:

``` text
Display / Hero      700–800
Page heading        700
Section heading     600–700
Control label       600
Body                400
Supporting text     400–500
```

## Spacing

Use consistent spacing rather than arbitrary values.

Suggested rhythm:

``` text
8   micro spacing
12  compact spacing
16  standard spacing
20  section spacing
24  comfortable spacing
32  major separation
40+ hero / major layout separation
```

Avoid excessive bottom padding. Scrollable screens should finish close
to their final content while leaving only enough clearance for
navigation and device safe areas.

## Components

### Primary button

Used for the main action of a screen.

Examples:

-   Save application
-   Save changes
-   Complete an important flow

### Secondary button

Used for supporting actions.

Examples:

-   Add task
-   Cancel
-   Secondary navigation

Primary and secondary actions should not compete visually.

### Status

Statuses should communicate state without dominating the interface.

Avoid excessive pills, oversized badges, and bright colors.

### Application card

Application cards should prioritize:

1.  Company
2.  Position
3.  Location / work setup
4.  Current status
5.  Relevant date or next action

Avoid decorative initials badges and unnecessary timeline ornaments when
they do not improve comprehension.

### Task

Tasks belong to the application context.

A task should support:

-   Title
-   Due date
-   Notes
-   Completion state
-   Edit
-   Delete

## Motion

Motion should be:

-   Short
-   Predictable
-   Purposeful
-   Non-distracting

Avoid exaggerated spring or "jumping" animations.

Preferred interaction feedback:

-   Short opacity/fade transitions
-   Small press-scale feedback
-   Controlled state transitions

Animation should never delay a user's ability to complete an action.

## UX Rules

1.  Every screen should have a clear primary purpose.
2.  The most important action should have the strongest visual
    hierarchy.
3.  Do not make decorative elements look interactive.
4.  Avoid icons that imply unsupported functionality, such as AI/sparkle
    imagery when no AI feature exists.
5.  Keep forms readable and progressive.
6.  Keep task actions close to the task they belong to.
7.  Preserve user-entered data when navigating unless the user
    explicitly saves or cancels.
8.  Use empty states to explain what the user can do next.
9.  Avoid unnecessary scrolling and excessive whitespace.
10. Favor clarity over visual novelty.

## Accessibility

-   Maintain readable text contrast.
-   Use sufficiently large touch targets.
-   Do not rely on color alone to communicate status.
-   Provide clear labels for icon-only actions.
-   Keep destructive actions visually distinct and confirm when
    appropriate.
