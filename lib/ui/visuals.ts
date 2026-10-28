/**
 * Visual states of a journey step. Presentation only: the domain speaks
 * `VoteStatus`, the timeline maps it to what the user sees.
 */
export type TimelineVisual = "done" | "current" | "failed";
