import { OPlayingCardStackBehavior, OSuit, type PlayingCardStackData } from './types'
import Card2C from '@/img/playing-cards/2C.svg'
import Card2D from '@/img/playing-cards/2D.svg'
import Card2H from '@/img/playing-cards/2H.svg'
import Card2S from '@/img/playing-cards/2S.svg'

export const CARD_DIMS_CLASS = 'w-[6rem] h-[9rem]'

const TOP_ROW_Y = 20
const BOTTOM_ROW_Y = 240
export const initialCardStacks: PlayingCardStackData[] = [
    {
        cards: [
            { suit: OSuit.Clubs, rank: 1, cardImg: Card2C },
            { suit: OSuit.Diamonds, rank: 1, cardImg: Card2S }
        ],
        behavior: OPlayingCardStackBehavior.MoveAllNextSiblings,
        hasDropTarget: true,
        position: { x: 20, y: TOP_ROW_Y }
    }, {
        cards: [
            { suit: OSuit.Diamonds, rank: 1, cardImg: Card2D }
        ],
        behavior: OPlayingCardStackBehavior.MoveAllNextSiblings,
        hasDropTarget: true,
        position: { x: 130, y: TOP_ROW_Y }
    }, {
        cards: [
            { suit: OSuit.Hearts, rank: 1, cardImg: Card2H }
        ],
        behavior: OPlayingCardStackBehavior.MoveAllNextSiblings,
        hasDropTarget: true,
        position: { x: 240, y: TOP_ROW_Y }
    }, {
        cards: [],
        behavior: OPlayingCardStackBehavior.MoveIndividually,
        hasDropTarget: true,
        position: { x: 20, y: BOTTOM_ROW_Y }
    }, {
        cards: [],
        behavior: OPlayingCardStackBehavior.MoveIndividually,
        hasDropTarget: true,
        position: { x: 130, y: BOTTOM_ROW_Y }
    }, {
        cards: [],
        behavior: OPlayingCardStackBehavior.MoveIndividually,
        hasDropTarget: true,
        position: { x: 240, y: BOTTOM_ROW_Y }
    }
]