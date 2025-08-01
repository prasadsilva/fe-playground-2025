import { createContext, useCallback, useContext, useEffect, useState } from "react"
import type { PlayingCardData, PlayingCardStackData } from "./types"

class DragManager<T> {
    private trackedObjDragMoveCallback: ((canvasDeltaX: number, canvasDeltaY: number) => void) | undefined
    private trackedObjDragEndCallback: (() => void) | undefined
    private canvasPointerClientX: number
    private canvasPointerClientY: number
    private usageCount: number
    private currentDragData: T | null
    private dragStateChangeListeners: Set<(dragCard: T | null) => void>

    public constructor() {
        this.trackedObjDragMoveCallback = undefined
        this.trackedObjDragEndCallback = undefined
        this.canvasPointerClientX = -1
        this.canvasPointerClientY = -1
        this.usageCount = 0
        this.currentDragData = null
        this.dragStateChangeListeners = new Set
    }

    private setDragData(dragData: T | null) {
        this.currentDragData = dragData
        this.dragStateChangeListeners.forEach(callback => callback(this.currentDragData))
    }

    public addDragStateChangeListener(callback: (dragCard: T | null) => void) {
        this.dragStateChangeListeners.add(callback)
        if (this.usageCount === 0) {
            document.body.addEventListener('pointermove', this.trackCanvasPointer)
        }
        this.usageCount++
    }
    public removedragStateChangeListener(callback: (dragCard: T | null) => void) {
        this.dragStateChangeListeners.delete(callback)
        this.usageCount--
        if (this.usageCount === 0) {
            document.body.removeEventListener('pointermove', this.trackCanvasPointer)
        }
    }

    private trackCanvasPointer = (e: PointerEvent) => {
        const deltaX = e.clientX - this.canvasPointerClientX
        const deltaY = e.clientY - this.canvasPointerClientY
        if (this.trackedObjDragMoveCallback) {
            this.trackedObjDragMoveCallback(deltaX, deltaY)
        }
        this.canvasPointerClientX = e.clientX
        this.canvasPointerClientY = e.clientY
    }

    private registerPointerReleaseCallbacks = () => {
        document.body.addEventListener('pointerup', this.handlePointerReleaseNative)
        document.body.addEventListener('pointerleave', this.handlePointerReleaseNative)
        document.body.addEventListener('pointercancel', this.handlePointerReleaseNative)
    }

    private unregisterPointerReleaseCallbacks = () => {
        document.body.removeEventListener('pointerup', this.handlePointerReleaseNative)
        document.body.removeEventListener('pointerleave', this.handlePointerReleaseNative)
        document.body.removeEventListener('pointercancel', this.handlePointerReleaseNative)
    }

    private handlePointerReleaseNative = (_e: PointerEvent) => {
        this.clearActiveDragHandler()
    }

    public setActiveDragHandler = (dragData: T, onDragMove: (canvasDltaX: number, canvasDeltaY: number) => void, onDragEnd: () => void) => {
        // Already dragging - bail
        if (this.trackedObjDragMoveCallback) {
            console.warn('Already in drag mode')
            return
        }

        // Track elements
        this.trackedObjDragMoveCallback = onDragMove
        this.trackedObjDragEndCallback = onDragEnd

        // Register event listeners
        this.registerPointerReleaseCallbacks()

        this.setDragData(dragData)
    }
    public clearActiveDragHandler = () => {
        // Not dragging - bail
        if (!this.trackedObjDragMoveCallback) {
            console.warn('Unable to clear drag object. Not currently dragging an element.')
            return
        }

        // Clear elements
        this.trackedObjDragMoveCallback = undefined
        if (this.trackedObjDragEndCallback) {
            this.trackedObjDragEndCallback()
        }
        this.trackedObjDragEndCallback = undefined

        // Unregister event listeners
        this.unregisterPointerReleaseCallbacks()

        this.setDragData(null)
    }

}

class PlayingCardsContextData {
    private cardStacks: PlayingCardStackData[]
    private changeListeners: Set<() => void>
    private dragManager: DragManager<PlayingCardData>

    public constructor(cardStacksParam: PlayingCardStackData[]) {
        this.cardStacks = [...cardStacksParam]
        this.changeListeners = new Set
        this.dragManager = new DragManager
    }

    // TODO: When cardStacks changes, fire off all changeListeners

    public getCardStacks() { return this.cardStacks }

    public setActiveDragHandler(dragData: PlayingCardData, onDragMove: ((canvasDeltaX: number, canvasDeltaY: number) => void), onDragEnd: (() => void)) {
        this.dragManager.setActiveDragHandler(dragData, onDragMove, onDragEnd)
    }
    public addDragStateChangeListener(callback: (dragCard: PlayingCardData | null) => void) {
        this.dragManager.addDragStateChangeListener(callback)
    }
    public removeDragStateChangeListener(callback: (dragCard: PlayingCardData | null) => void) {
        this.dragManager.removedragStateChangeListener(callback)
    }

    public addChangeListener(callback: () => void) {
        this.changeListeners.add(callback)
    }
    public removeChangeListener(callback: () => void) {
        this.changeListeners.delete(callback)
    }
}

export const createNewPlayingCardsContextValue = (cardStacks: PlayingCardStackData[]) => new PlayingCardsContextData(cardStacks)
export const PlayingCardsContext = createContext<InstanceType<typeof PlayingCardsContextData>>(createNewPlayingCardsContextValue([]))
export type PlayingCardsContextType = typeof PlayingCardsContextData

export function usePlayingCardsModel() {
    const playingCardsContext = useContext(PlayingCardsContext)
    const [cardStacks, setCardStacks] = useState(playingCardsContext.getCardStacks())

    const handleContextChange = useCallback(() => {
        setCardStacks(playingCardsContext.getCardStacks())
    }, [playingCardsContext])

    useEffect(() => {
        playingCardsContext.addChangeListener(handleContextChange);
        return () => playingCardsContext.removeChangeListener(handleContextChange)
    }, [playingCardsContext])

    return {
        cardStacks
    }
}

export function usePlayingCardsDragManager() {
    const playingCardsContext = useContext(PlayingCardsContext)
    const [activeDragCard, setActiveDragCard] = useState<PlayingCardData | null>(null)

    const handleActiveDragChange = useCallback((dragCard: PlayingCardData | null) => {
        setActiveDragCard(dragCard)
    }, [])

    useEffect(() => {
        playingCardsContext.addDragStateChangeListener(handleActiveDragChange)
        return () => playingCardsContext.removeDragStateChangeListener(handleActiveDragChange)
    }, [playingCardsContext])

    const setActiveDrag = useCallback((dragData: PlayingCardData, onDragMove: ((canvasDeltaX: number, canvasDeltaY: number) => void), onDragEnd: (() => void)) => {
        playingCardsContext.setActiveDragHandler(dragData, onDragMove, onDragEnd)
    }, [playingCardsContext])

    return {
        activeDragCard,
        setActiveDrag
    }
}
