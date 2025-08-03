import { OSuit, type PlayingCardStackData } from './types'
import Card2C from '@/img/playing-cards/2C.svg'
import Card2D from '@/img/playing-cards/2D.svg'
import Card2H from '@/img/playing-cards/2H.svg'
import Card2S from '@/img/playing-cards/2S.svg'
import { PlayingCardsCanvas } from './playing-cards-canvas'
import { createNewPlayingCardsContextValue, PlayingCardsContext } from './playing-cards-context'

const initialCardStacks: PlayingCardStackData[] = [
    {
        cards: [
            { suit: OSuit.Clubs, rank: 1, cardImg: Card2C },
            { suit: OSuit.Diamonds, rank: 1, cardImg: Card2D }
        ],
        hasDropTarget: true,
        position: { x: 30, y: 30 }
    }, {
        cards: [
            { suit: OSuit.Diamonds, rank: 1, cardImg: Card2D }
        ],
        hasDropTarget: true,
        position: { x: 180, y: 30 }
    }, {
        cards: [
            { suit: OSuit.Hearts, rank: 1, cardImg: Card2H }
        ],
        hasDropTarget: true,
        position: { x: 330, y: 30 }
    }, {
        cards: [
            { suit: OSuit.Spades, rank: 1, cardImg: Card2S }
        ],
        hasDropTarget: true,
        position: { x: 480, y: 30 }
    }, {
        cards: [],
        hasDropTarget: true,
        position: { x: 30, y: 200 }
    }, {
        cards: [],
        hasDropTarget: true,
        position: { x: 180, y: 200 }
    }, {
        cards: [],
        hasDropTarget: true,
        position: { x: 330, y: 200 }
    }, {
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
                <div>The following is an exploration of drag-n-drop behavior while staying within React and not using any dnd libraries and not using the draggable property.</div>
                <div>The top row allows moving cards as a stack. The bottom row allows moving cards individually.</div>
            </div>
            <PlayingCardsContext value={createNewPlayingCardsContextValue(initialCardStacks)}>
                <PlayingCardsCanvas />
            </PlayingCardsContext>
        </div >
    )
}