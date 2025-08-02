import { OSuit, type PlayingCardStackData } from './types'
import Card2C from '@/img/playing-cards/2C.svg'
import Card2D from '@/img/playing-cards/2D.svg'
import Card2H from '@/img/playing-cards/2H.svg'
import Card2S from '@/img/playing-cards/2S.svg'
import { PlayingCardsCanvas } from './playing-cards-canvas'
import { createNewPlayingCardsContextValue, PlayingCardsContext } from './playing-cards-context'

const initialCardStacks: PlayingCardStackData[] = [
    {
        stackId: 0,
        cards: [
            { stackInfo: { stackId: 0, cardIndex: 0 }, descriptor: { suit: OSuit.Clubs, rank: 1, cardImg: Card2C } },
            { stackInfo: { stackId: 0, cardIndex: 1 }, descriptor: { suit: OSuit.Diamonds, rank: 1, cardImg: Card2D } }
        ],
        hasDropTarget: true,
        position: { x: 30, y: 30 }
    }, {
        stackId: 1,
        cards: [
            { stackInfo: { stackId: 1, cardIndex: 0 }, descriptor: { suit: OSuit.Diamonds, rank: 1, cardImg: Card2D } }
        ],
        hasDropTarget: true,
        position: { x: 180, y: 30 }
    }, {
        stackId: 2,
        cards: [
            { stackInfo: { stackId: 2, cardIndex: 0 }, descriptor: { suit: OSuit.Hearts, rank: 1, cardImg: Card2H } }
        ],
        hasDropTarget: true,
        position: { x: 330, y: 30 }
    }, {
        stackId: 3,
        cards: [
            { stackInfo: { stackId: 3, cardIndex: 0 }, descriptor: { suit: OSuit.Spades, rank: 1, cardImg: Card2S } }
        ],
        hasDropTarget: true,
        position: { x: 480, y: 30 }
    }, {
        stackId: 4,
        cards: [],
        hasDropTarget: true,
        position: { x: 30, y: 200 }
    }, {
        stackId: 5,
        cards: [],
        hasDropTarget: true,
        position: { x: 180, y: 200 }
    }, {
        stackId: 6,
        cards: [],
        hasDropTarget: true,
        position: { x: 330, y: 200 }
    }, {
        stackId: 7,
        cards: [],
        hasDropTarget: true,
        position: { x: 480, y: 200 }
    }
]

export function PlayingCards() {
    return (
        <div className='p-3 select-none'>
            <h1 className='mb-3'>Playing Cards</h1>
            <div className='pb-3'>
                The following is an exploration of drag-n-drop behavior while staying within React and not using any dnd libraries and not using the draggable property.
            </div>
            <PlayingCardsContext value={createNewPlayingCardsContextValue(initialCardStacks)}>
                <PlayingCardsCanvas />
            </PlayingCardsContext>
        </div >
    )
}