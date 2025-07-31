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

export interface PlayingCardData {
    suit: Suit,
    //    A                                            J    Q    K
    rank: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13,
    cardImg: string
}