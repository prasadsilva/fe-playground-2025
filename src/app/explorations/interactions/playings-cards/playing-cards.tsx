import { Outlet } from "@tanstack/react-router";
import Card2C from '@/img/playing-cards/2C.svg'
import Card2D from '@/img/playing-cards/2D.svg'
import Card2H from '@/img/playing-cards/2H.svg'
import Card2S from '@/img/playing-cards/2S.svg'
import CardOutline from '@/img/playing-cards/outline.svg'
import { useRef, type DragEventHandler } from "react";

// https://www.typescriptlang.org/docs/handbook/enums.html#objects-vs-enums
const OSuit = {
    Clubs: 0,
    Diamonds: 1,
    Hearts: 2,
    Spades: 3,
} as const;
type Suit = typeof OSuit[keyof typeof OSuit];
// Usage:
// function foo(param: Suit) { ... }
// const someVar = {..., enumValue: OSuit, ... }

interface PlayingCardData {
    suit: Suit,
    //    A                                            J    Q    K
    rank: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13,
    cardImg: string
}

interface PlayingCardProps {
    data: PlayingCardData,

}
function PlayingCard({ data }: PlayingCardProps) {
    const draggableRef = useRef<HTMLImageElement>(null);

    const handleDragStart = (e: React.DragEvent<HTMLImageElement>) => {
        console.log('drag start')
        setTimeout(() => {
            if (!draggableRef.current) return;
            draggableRef.current.hidden = true;
        }, 10);
    }
    const handleDragEnd = (e: React.DragEvent<HTMLImageElement>) => {
        console.log('drag end')
        setTimeout(() => {
            if (!draggableRef.current) return;
            draggableRef.current.hidden = false;
        })
    }

    return (
        <div className="absolute h-36">
            <img ref={draggableRef} src={data.cardImg} className="h-full" draggable onDragStart={handleDragStart} onDragEnd={handleDragEnd} />
        </div>
    )
}

interface PlayingCardSlotProps {
    position?: {
        x: number,
        y: number
    },
}
function PlayingCardSlot({ position }: PlayingCardSlotProps) {
    return (
        <div className={`h-36`} style={position && { position: 'absolute', left: `${position.x}px`, top: `${position.y}px` }}>
            <img src={CardOutline} className="h-full" />
        </div>
    )
}

export function PlayingCards() {
    return (
        <div className='p-3'>
            <h1 className='mb-3'>Playing Cards</h1>
            <div className='pb-3'>
                The following is an exploration of drag-n-drop behavior while staying within React.
            </div>
            <div className="pb-3">
                <div className='relative flex flex-col gap-3'>
                    <PlayingCard data={{ suit: OSuit.Clubs, rank: 1, cardImg: Card2C }} />
                    <PlayingCard data={{ suit: OSuit.Diamonds, rank: 1, cardImg: Card2D }} />
                    <PlayingCard data={{ suit: OSuit.Hearts, rank: 1, cardImg: Card2H }} />
                    <PlayingCard data={{ suit: OSuit.Spades, rank: 1, cardImg: Card2S }} />
                    <div className="flex flex-row gap-3">
                        <PlayingCardSlot />
                        <PlayingCardSlot />
                        <PlayingCardSlot />
                        <PlayingCardSlot />
                    </div>
                    <div className="flex flex-row gap-3">
                        <PlayingCardSlot />
                        <PlayingCardSlot />
                        <PlayingCardSlot />
                        <PlayingCardSlot />
                    </div>
                </div>
            </div>
            <Outlet />
        </div >
    )
}