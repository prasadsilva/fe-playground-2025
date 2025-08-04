import { initialCardStacks } from './data'
import { PlayingCardsCanvas } from './playing-cards-canvas'
import { createNewPlayingCardsContextValue, PlayingCardsContext } from './playing-cards-context'

export function PlayingCards() {
    return (
        <div className='p-3 select-none'>
            <h1 className='mb-3'>Playing Cards</h1>
            <div className='pb-3'>
                <div>The following is an exploration of drag-n-drop behavior while staying within React, not using the HTML drag and drop API and not using any dnd libraries.</div>
                <div>The top row allows moving cards as a stack. The bottom row allows moving cards individually.</div>
            </div>
            <PlayingCardsContext value={createNewPlayingCardsContextValue(initialCardStacks)}>
                <PlayingCardsCanvas />
            </PlayingCardsContext>
        </div >
    )
}