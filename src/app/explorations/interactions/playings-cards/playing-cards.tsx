import Card2C from '@/img/playing-cards/2C.svg'
import Card2D from '@/img/playing-cards/2D.svg'
import Card2H from '@/img/playing-cards/2H.svg'
import Card2S from '@/img/playing-cards/2S.svg'
import CardOutline from '@/img/playing-cards/outline.svg'
import { OSuit, type PlayingCardData } from "./types";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type Ref, type RefObject } from 'react'

interface PlayingCardProps {
    name: string,
    data: PlayingCardData,
    canvasPosition: {
        x: number,
        y: number
    },
}
function PlayingCard({ name, data, canvasPosition }: PlayingCardProps) {
    const objRef = useRef<HTMLDivElement>(null)
    const draggingContext = useContext(DraggingContext)
    const [translate, setTranslate] = useState({
        x: canvasPosition.x,
        y: canvasPosition.y
    });

    const registerPointerReleaseCallbacks = useCallback(() => {
        if (!objRef.current) return;
        const element = objRef.current;
        element.addEventListener('pointerup', handlePointerReleaseNative)
        element.addEventListener('pointerleave', handlePointerReleaseNative)
        element.addEventListener('pointercancel', handlePointerReleaseNative)
    }, [objRef])

    const unregisterPointerReleaseCallbacks = useCallback(() => {
        if (!objRef.current) return;
        const element = objRef.current;
        element.removeEventListener('pointerup', handlePointerReleaseNative)
        element.removeEventListener('pointerleave', handlePointerReleaseNative)
        element.removeEventListener('pointercancel', handlePointerReleaseNative)
    }, [objRef])

    const handlePointerCapture = useCallback((e: React.PointerEvent) => {
        console.log('handlePointerCapture')
        if (!objRef) return;
        registerPointerReleaseCallbacks()
        draggingContext.setDragObject(objRef, e.clientX, e.clientY, handleDrag)
    }, [objRef])

    const handlePointerReleaseNative = useCallback((e: PointerEvent) => {
        console.log('handlePointerReleaseNative')
        unregisterPointerReleaseCallbacks()
        draggingContext.clearDragObject(objRef)
    }, [objRef])

    const handleDrag = useCallback((e: PointerEvent) => {
        console.log(`handleDrag called for ${name}`)
        setTranslate(prev => ({
            x: prev.x + e.movementX,
            y: prev.y + e.movementY
        }))
    }, [])

    return (
        <div
            id={name}
            ref={objRef}
            className="absolute h-36"
            style={{
                transform: `translateX(${translate.x}px) translateY(${translate.y}px)`
            }}
            onPointerDown={handlePointerCapture}
        >
            <img src={data.cardImg} className="h-full" />
        </div>
    )
}

interface PlayingCardSlotProps {
    initialCardData?: PlayingCardData,
    canvasPosition: {
        x: number,
        y: number
    },
}
function PlayingCardSlot({ initialCardData: initialCard, canvasPosition }: PlayingCardSlotProps) {
    return (
        <>
            <div className={`absolute h-36 w-fit`} style={{ left: `${canvasPosition.x}px`, top: `${canvasPosition.y}px` }}>
                <img src={CardOutline} className="h-full" />
            </div>
            {
                initialCard && (
                    <PlayingCard name={`${initialCard.suit}.${initialCard.rank}`} data={initialCard} canvasPosition={canvasPosition} />
                )
            }
        </>
    )
}

class DraggingContextData {
    private canvasRef: RefObject<HTMLElement | null> | undefined
    private trackedObjRef: RefObject<HTMLElement | null> | undefined
    private trackedObjDragMoveCallback: ((e: PointerEvent) => void) | undefined
    private dragOffsetX: number
    private dragOffsetY: number
    private lastPointerClientX: number
    private lastPointerClientY: number

    public constructor() {
        console.log('ctor')
        this.canvasRef = undefined
        this.trackedObjRef = undefined
        this.trackedObjDragMoveCallback = undefined
        this.dragOffsetX = -1
        this.dragOffsetY = -1
        // this.targetX = -1
        // this.targetY = -1
        this.lastPointerClientX = -1
        this.lastPointerClientY = -1
    }

    private handlePointerMove = (e: PointerEvent) => {
        if (!this.trackedObjRef || !this.trackedObjRef.current) return;
        console.log(`pointer move for -> ${this.trackedObjRef.current.getAttribute('id')}`);
        if (!this.trackedObjDragMoveCallback) return;
        this.trackedObjDragMoveCallback(e)

        const deltaX = e.clientX - this.lastPointerClientX
        const deltaY = e.clientY - this.lastPointerClientY
        const element = this.trackedObjRef.current
        // this.trackedObjRef.current.style.left = `${e.clientX - this.dragOffsetX}px`
        // this.trackedObjRef.current.style.top = `${e.clientX - this.dragOffsetY}px`
        // element.style.translate = `${deltaX}px ${deltaY}px`
        this.lastPointerClientX = e.clientX
        this.lastPointerClientY = e.clientY
    }

    public setDragObject = (objRef: RefObject<HTMLElement | null>, pointerClientX: number, pointerClientY: number, onDragMove: (e: PointerEvent) => void) => {
        if (!this.canvasRef || !this.canvasRef.current) return
        if (this.trackedObjDragMoveCallback) return
        console.log(`setDragObject: ${objRef}`)
        this.trackedObjRef = objRef
        this.trackedObjDragMoveCallback = onDragMove
        if (!this.trackedObjRef || !this.trackedObjRef.current) return;
        const element = this.trackedObjRef.current
        console.log(`pointer down on -> ${element.getAttribute('id')}`);
        // if (!objRef || !objRef.current) return;
        // console.log(`pointer down on -> ${objRef.current.getAttribute('id')}`);
        // console.dir(objRef.current, { depth: 3 })
        window.addEventListener('pointermove', this.handlePointerMove);
        const targetClientRect = element.getBoundingClientRect()

        this.lastPointerClientX = pointerClientX
        this.lastPointerClientY = pointerClientY
        this.dragOffsetX = pointerClientX - targetClientRect.x
        this.dragOffsetY = pointerClientY - targetClientRect.y
        console.log(`drag offsets: ${this.dragOffsetX}, ${this.dragOffsetY}`)
    }
    public clearDragObject = (objRef: RefObject<HTMLElement | null>) => {
        if (!this.canvasRef || !this.canvasRef.current) return
        this.trackedObjRef = objRef
        this.trackedObjDragMoveCallback = undefined
        if (!this.trackedObjRef || !this.trackedObjRef.current) return;
        console.log(`pointer up on -> ${this.trackedObjRef.current.getAttribute('id')}`);
        // if (!objRef || !objRef.current) return;
        // console.log(`pointer up on -> ${objRef.current.getAttribute('id')}`);
        // console.dir(objRef.current, { depth: 3 })
        window.removeEventListener('pointermove', this.handlePointerMove)
    }
    public setCanvas = (canvasRef: RefObject<HTMLElement | null>) => {
        this.canvasRef = canvasRef
    }
}
type InstanceType<T extends abstract new (...args: any) => any> = T extends abstract new (...args: any) => infer R ? R : any;

const createNewDraggingContextValue = () => new DraggingContextData()
const DraggingContext = createContext<InstanceType<typeof DraggingContextData>>(createNewDraggingContextValue())

function PlayingCardCanvas() {
    const canvasRef = useRef<HTMLDivElement>(null)
    const [draggingContextValue] = useState<InstanceType<typeof DraggingContextData>>(createNewDraggingContextValue)
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

export function PlayingCards() {
    return (
        <div className='p-3 select-none'>
            <h1 className='mb-3'>Playing Cards</h1>
            <div className='pb-3'>
                The following is an exploration of drag-n-drop behavior while staying within React and not using any dnd libraries and not using the draggable property.
            </div>
            <PlayingCardCanvas />
        </div >
    )
}