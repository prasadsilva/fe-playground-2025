import { PlayingCanvas } from './playing-canvas'
import { PlayingCardSlot } from './playing-card-slot'
import { OSuit } from './types'
import Card2C from '@/img/playing-cards/2C.svg'
import Card2D from '@/img/playing-cards/2D.svg'
import Card2H from '@/img/playing-cards/2H.svg'
import Card2S from '@/img/playing-cards/2S.svg'

export function PlayingCards() {
    return (
        <div className='p-3 select-none'>
            <h1 className='mb-3'>Playing Cards</h1>
            <div className='pb-3'>
                The following is an exploration of drag-n-drop behavior while staying within React and not using any dnd libraries and not using the draggable property.
            </div>
            <PlayingCanvas>
                <PlayingCardSlot initialCardData={{ suit: OSuit.Clubs, rank: 1, cardImg: Card2C }} initialCanvasPosition={{ x: 30, y: 30 }} />
                <PlayingCardSlot initialCardData={{ suit: OSuit.Diamonds, rank: 1, cardImg: Card2D }} initialCanvasPosition={{ x: 180, y: 30 }} />
                <PlayingCardSlot initialCardData={{ suit: OSuit.Hearts, rank: 1, cardImg: Card2H }} initialCanvasPosition={{ x: 330, y: 30 }} />
                <PlayingCardSlot initialCardData={{ suit: OSuit.Spades, rank: 1, cardImg: Card2S }} initialCanvasPosition={{ x: 480, y: 30 }} />

                <PlayingCardSlot initialCanvasPosition={{ x: 30, y: 200 }} />
                <PlayingCardSlot initialCanvasPosition={{ x: 180, y: 200 }} />
                <PlayingCardSlot initialCanvasPosition={{ x: 330, y: 200 }} />
                <PlayingCardSlot initialCanvasPosition={{ x: 480, y: 200 }} />
            </PlayingCanvas>
        </div >
    )
}