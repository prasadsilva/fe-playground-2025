import { useEffect, useRef, useState } from "react"
import { createNewDraggingContextValue, DraggingContext, type DraggingContextType } from "./dragging-context"
import { PlayingCardSlot } from "./playing-card-slot"
import { OSuit } from "./types"
import Card2C from '@/img/playing-cards/2C.svg'
import Card2D from '@/img/playing-cards/2D.svg'
import Card2H from '@/img/playing-cards/2H.svg'
import Card2S from '@/img/playing-cards/2S.svg'

export function PlayingCanvas() {
    const canvasRef = useRef<HTMLDivElement>(null)
    const [draggingContextValue] = useState<InstanceType<DraggingContextType>>(createNewDraggingContextValue)
    useEffect(() => {
        draggingContextValue.setCanvas(canvasRef)
    }, [])
    return (
        <DraggingContext value={draggingContextValue}>
            <div ref={canvasRef} className="relative">
                <PlayingCardSlot initialCardData={{ suit: OSuit.Clubs, rank: 1, cardImg: Card2C }} canvasPosition={{ x: 30, y: 30 }} />
                <PlayingCardSlot initialCardData={{ suit: OSuit.Diamonds, rank: 1, cardImg: Card2D }} canvasPosition={{ x: 180, y: 30 }} />
                <PlayingCardSlot initialCardData={{ suit: OSuit.Hearts, rank: 1, cardImg: Card2H }} canvasPosition={{ x: 330, y: 30 }} />
                <PlayingCardSlot initialCardData={{ suit: OSuit.Spades, rank: 1, cardImg: Card2S }} canvasPosition={{ x: 480, y: 30 }} />

                <PlayingCardSlot canvasPosition={{ x: 30, y: 200 }} />
                <PlayingCardSlot canvasPosition={{ x: 180, y: 200 }} />
                <PlayingCardSlot canvasPosition={{ x: 330, y: 200 }} />
                <PlayingCardSlot canvasPosition={{ x: 480, y: 200 }} />
            </div>
        </DraggingContext>
    )
}