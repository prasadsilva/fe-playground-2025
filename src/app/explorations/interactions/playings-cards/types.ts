// https://www.typescriptlang.org/docs/handbook/enums.html#objects-vs-enums
export const OSuit = {
    Clubs: 0,
    Diamonds: 1,
    Hearts: 2,
    Spades: 3,
} as const;
export type Suit = typeof OSuit[keyof typeof OSuit];
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

export interface PlayingCardDropTargetData {
    parentStackId: number
}

export interface PlayingCardData {
    parentStackId: number,
    cardIndex: number,
    descriptor: PlayingCardDescriptor
}

export interface PlayingCardStackData {
    stackId: number,
    cards: PlayingCardData[],
    hasDropTarget: boolean,
    position: PlayingCanvasPosition
}