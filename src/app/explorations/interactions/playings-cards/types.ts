// NOTE: This file cannot be .d.ts. We are exporting an object.

// https://www.typescriptlang.org/docs/handbook/enums.html#objects-vs-enums
export const OSuit = {
    Clubs: 0,
    Diamonds: 1,
    Hearts: 2,
    Spades: 3,
} as const;
export type Suit = typeof OSuit[keyof typeof OSuit]
// Usage:
// function foo(param: Suit) { ... }
// const someVar = {..., enumValue: OSuit, ... }

export interface PlayingCardDescriptor {
    suit: Suit,
    //    A                                            J    Q    K
    rank: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13,
    cardImg: string
}

export interface PlayingCanvasPosition {
    x: number,
    y: number
}

export interface PlayingCardStackInfo {
    stackIndex: number,
    cardIndex: number,
}

export const OPlayingCardStackBehavior = {
    MoveIndividually: 0,
    MoveAllNextSiblings: 1
} as const;
export type PlayingCardStackBehavior = typeof OPlayingCardStackBehavior[keyof typeof OPlayingCardStackBehavior]
// Usage:
// function foo(param: StackBehavior) { ... }
// const someVar = {..., enumValue: OStackBehavior, ... }

export interface PlayingCardStackData {
    cards: PlayingCardDescriptor[],
    behavior: PlayingCardStackBehavior,
    hasDropTarget: boolean,
    position: PlayingCanvasPosition
}