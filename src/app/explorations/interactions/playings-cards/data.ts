import { OPlayingCardStackBehavior, OSuit, type PlayingCardStackData } from './types'
import Card2C from '@/img/playing-cards/2C.svg'
import Card2D from '@/img/playing-cards/2D.svg'
import Card2H from '@/img/playing-cards/2H.svg'
import Card2S from '@/img/playing-cards/2S.svg'

export const CARD_DIMS_CLASS = 'w-[6rem] h-[9rem]'

export const initialCardStacks: PlayingCardStackData[] = [
    {
        cards: [
            { suit: OSuit.Clubs, rank: 1, cardImg: Card2C },
            { suit: OSuit.Diamonds, rank: 1, cardImg: Card2D }
        ],
        behavior: OPlayingCardStackBehavior.MoveAllNextSiblings,
        hasDropTarget: true,
        position: { x: 30, y: 30 }
    }, {
        cards: [
            { suit: OSuit.Diamonds, rank: 1, cardImg: Card2D }
        ],
        behavior: OPlayingCardStackBehavior.MoveAllNextSiblings,
        hasDropTarget: true,
        position: { x: 180, y: 30 }
    }, {
        cards: [
            { suit: OSuit.Hearts, rank: 1, cardImg: Card2H }
        ],
        behavior: OPlayingCardStackBehavior.MoveAllNextSiblings,
        hasDropTarget: true,
        position: { x: 330, y: 30 }
    }, {
        cards: [
            { suit: OSuit.Spades, rank: 1, cardImg: Card2S }
        ],
        behavior: OPlayingCardStackBehavior.MoveAllNextSiblings,
        hasDropTarget: true,
        position: { x: 480, y: 30 }
    }, {
        cards: [],
        behavior: OPlayingCardStackBehavior.MoveIndividually,
        hasDropTarget: true,
        position: { x: 30, y: 200 }
    }, {
        cards: [],
        behavior: OPlayingCardStackBehavior.MoveIndividually,
        hasDropTarget: true,
        position: { x: 180, y: 200 }
    }, {
        cards: [],
        behavior: OPlayingCardStackBehavior.MoveIndividually,
        hasDropTarget: true,
        position: { x: 330, y: 200 }
    }, {
        cards: [],
        behavior: OPlayingCardStackBehavior.MoveIndividually,
        hasDropTarget: true,
        position: { x: 480, y: 200 }
    }
]