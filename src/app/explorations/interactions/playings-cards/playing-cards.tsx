import { PlayingCanvas } from './playing-canvas'

export function PlayingCards() {
    return (
        <div className='p-3 select-none'>
            <h1 className='mb-3'>Playing Cards</h1>
            <div className='pb-3'>
                The following is an exploration of drag-n-drop behavior while staying within React and not using any dnd libraries and not using the draggable property.
            </div>
            <PlayingCanvas />
        </div >
    )
}