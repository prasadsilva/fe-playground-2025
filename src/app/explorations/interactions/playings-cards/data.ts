import { OPlayingCardStackBehavior, OSuit, type PlayingCardStackData } from './types'
import Card2C from '@/img/playing-cards/2C.svg'
import Card2D from '@/img/playing-cards/2D.svg'
import Card2H from '@/img/playing-cards/2H.svg'
import Card2S from '@/img/playing-cards/2S.svg'
import { LAYOUT_CONSTANTS } from './constants'
export const initialCardStacks: PlayingCardStackData[] = [
    {
        cards: [
            { suit: OSuit.Clubs, rank: 1, cardImg: Card2C },
            { suit: OSuit.Diamonds, rank: 1, cardImg: Card2D }
        ],
        behavior: OPlayingCardStackBehavior.MoveAllNextSiblings,
        hasDropTarget: true,
        position: { x: 20, y: LAYOUT_CONSTANTS.TOP_ROW_Y }
    }, {
        cards: [
            { suit: OSuit.Spades, rank: 1, cardImg: Card2S }
        ],
        behavior: OPlayingCardStackBehavior.MoveAllNextSiblings,
        hasDropTarget: true,
        position: { x: 130, y: LAYOUT_CONSTANTS.TOP_ROW_Y }
    }, {
        cards: [
            { suit: OSuit.Hearts, rank: 1, cardImg: Card2H }
        ],
        behavior: OPlayingCardStackBehavior.MoveAllNextSiblings,
        hasDropTarget: true,
        position: { x: 240, y: LAYOUT_CONSTANTS.TOP_ROW_Y }
    }, {
        cards: [],
        behavior: OPlayingCardStackBehavior.MoveIndividually,
        hasDropTarget: true,
        position: { x: 20, y: LAYOUT_CONSTANTS.BOTTOM_ROW_Y }
    }, {
        cards: [],
        behavior: OPlayingCardStackBehavior.MoveIndividually,
        hasDropTarget: true,
        position: { x: 130, y: LAYOUT_CONSTANTS.BOTTOM_ROW_Y }
    }, {
        cards: [],
        behavior: OPlayingCardStackBehavior.MoveIndividually,
        hasDropTarget: true,
        position: { x: 240, y: LAYOUT_CONSTANTS.BOTTOM_ROW_Y }
    }
]