# Retro-Tech Academy: Future Implementation Notes

## Current Product Direction

Retro-Tech Academy is a local-first learning app for seniors. The design metaphor is a 1950s-1960s television lesson broadcast with a separate remote control.

The TV screen should be where learning happens. The remote should feel like a channel changer, not like the way to complete lessons.

## Hard UX Rule For The Next Feature

The remote must only change the channel.

Keep these remote controls:

- Channel 01, 02, and 03 buttons.
- Previous channel.
- Next channel.
- Optional visual dial animation tied to the active channel.

Remove or disable these remote controls:

- Main lesson action button.
- Replay lesson button.
- Punch card button.
- Any button that completes progress, answers a lesson, or advances an in-lesson game.
- Clear-card action from the remote body. If reset is needed, place it somewhere secondary outside the remote, such as a small settings or progress area.

## Lesson Interaction Model

Each module should require the learner to interact directly with the TV screen. Completion should come from the correct on-screen interaction, not from the remote.

### Channel 01: The Switchboard

Status: partly implemented.

Expected behavior:

- The user must tap/click the Tap plate.
- The user must swipe/drag horizontally on the Swipe plate.
- The user must scroll inside the Scroll window.
- The module is complete only after all three gestures are detected.

Keep improving this as an actual gesture-practice module. Avoid replacing these gestures with buttons.

### Channel 02: The Neighborhood Watch

Status: implemented as an on-screen mail sorting game.

Goal: Teach scam and phishing recognition through on-screen mail sorting.

Current expected behavior:

- Show one mail item at a time on the TV screen.
- Ask the learner whether they should open it or check it first.
- The choices should be on-screen buttons, not remote buttons.
- Example choices:
  - Open it
  - Check it first
  - Ask someone trusted
  - Ignore/report
- A safe or legitimate message can allow Open it.
- A suspicious message should require Check it first, Ask someone trusted, or Ignore/report.
- If the learner chooses correctly, show a short positive result and move to the next mail item.
- If the learner chooses incorrectly, show a funny, gentle failure state that explains the warning sign. Keep the humor kind and non-shaming.

Example failure tone:

- "The salesman twirled his moustache and vanished with your prize code. Try checking the sender first."
- "That urgent letter was wearing a fake badge. Slow down and inspect the address."
- "The offer sounded shinier than a brand-new toaster, but the link was suspicious."

Avoid harsh failure language. The user should feel coached, not punished.

Suggested mail examples:

- Legitimate appointment reminder from a known clinic.
- Fake bank warning with a strange sender address.
- Prize message for a contest the user never entered.
- Delivery notice with a mismatched link.
- Message from a family member asking for help, but with unusual wording.

Completion rule:

- The learner should correctly handle a small set of mail items before earning the Watch Captain stamp. The current implementation completes the module after 3 correct mail decisions.
- Store completion through the existing Zustand/localStorage progress system.

### Channel 03: The Master Key

Future feature.

Goal: Teach passwords and privacy through on-screen lock/key decisions.

Expected behavior:

- Keep all lesson answers and decisions on the TV screen.
- Teach that strong passwords are long, unique, and private.
- Include a simple choice-based game where the user chooses the safest key/password or privacy action.
- Completion should require correct on-screen choices, not the remote.

## Implementation Constraints

- Keep the app Vercel-friendly and statically exportable.
- Do not add a backend, database, authentication, or account system.
- Continue using localStorage via Zustand persist for progress.
- Keep the senior-friendly interaction style:
  - Large targets.
  - Clear contrast.
  - Minimal jargon.
  - Kind feedback.
  - No time pressure.
- Preserve the mid-century TV and remote visual metaphor.
- The TV screen is the active lesson surface.
- The remote is only for changing channels.

## Suggested Next Code Changes

1. Improve Channel 03 into a fuller on-screen password and privacy lesson.
2. Keep `RemoteControl` limited to channel navigation only.
3. Keep reset/progress actions outside the remote body.
4. Add more mail scenarios if Channel 02 needs more replay value.
5. Keep `npm run build` passing after changes.
