import { createContext, useCallback, useContext, useEffect, useState } from "react"
import type { PlayingCardData, PlayingCardStackData, PlayingCardStackInfo } from "./types"
import type { Immutable } from "@/lib/types"
import { deepFreeze } from "@/lib/utils"

class DragManager<T> {
    private trackedObjDragMoveCallback: ((canvasDeltaX: number, canvasDeltaY: number) => void) | undefined
    private trackedObjDragEndCallback: (() => void) | undefined
    private canvasPointerClientX: number
    private canvasPointerClientY: number
    private usageCount: number
    private currentDragData: T | null
    private dragStateChangeListeners: Set<(dragCard: T | null) => void>
    private dropCallback: (dragData: T) => void | null

    public constructor(dropCallback: typeof this.dropCallback) {
        this.trackedObjDragMoveCallback = undefined
        this.trackedObjDragEndCallback = undefined
        this.canvasPointerClientX = -1
        this.canvasPointerClientY = -1
        this.usageCount = 0
        this.currentDragData = null
        this.dragStateChangeListeners = new Set
        this.dropCallback = dropCallback
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
        document.body.addEventListener('pointerleave', this.handlePointerInvalidNative)
        document.body.addEventListener('pointercancel', this.handlePointerInvalidNative)
    }

    private unregisterPointerReleaseCallbacks = () => {
        document.body.removeEventListener('pointerup', this.handlePointerReleaseNative)
        document.body.removeEventListener('pointerleave', this.handlePointerInvalidNative)
        document.body.removeEventListener('pointercancel', this.handlePointerInvalidNative)
    }

    private handlePointerReleaseNative = (_e: PointerEvent) => {
        if (this.currentDragData) {
            this.dropCallback(this.currentDragData)
        }
        this.clearActiveDragHandler()
    }
    private handlePointerInvalidNative = (_e: PointerEvent) => {
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
    private cardStacks: Immutable<PlayingCardStackData[]>
    private changeListeners: Set<() => void>
    private dragManager: DragManager<PlayingCardData>
    private activeDropTarget: PlayingCardStackInfo | null

    public constructor(cardStacksParam: PlayingCardStackData[]) {
        this.cardStacks = deepFreeze(cardStacksParam)
        this.changeListeners = new Set
        this.dragManager = new DragManager((card) => this.tryHandleDrop(card))
        this.activeDropTarget = null
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

    public setActiveDropTarget(stackInfo: PlayingCardStackInfo) {
        this.activeDropTarget = stackInfo
    }
    public clearActiveDropTarget() {
        this.activeDropTarget = null
    }
    private tryHandleDrop(card: PlayingCardData) {
        if (this.activeDropTarget) {
            this.moveBetweenStacks(card.stackInfo, this.activeDropTarget)
        } else {
            // Force reset
            this.fireModelChange()
        }
        this.clearActiveDropTarget()
    }

    public addChangeListener(callback: () => void) {
        this.changeListeners.add(callback)
    }
    public removeChangeListener(callback: () => void) {
        this.changeListeners.delete(callback)
    }
    private fireModelChange() {
        this.changeListeners.forEach(callback => callback())
    }

    private moveBetweenStacks(sourceStackInfo: PlayingCardStackInfo, targetStackInfo: PlayingCardStackInfo) {
        const sourceStackIdx = this.cardStacks.findIndex(cardStack => cardStack.stackId === sourceStackInfo.stackId)
        if (sourceStackIdx === -1) {
            console.warn('Unable to move card. Source stack is invalid')
            return
        }
        const targetStackIdx = this.cardStacks.findIndex(cardStack => cardStack.stackId === targetStackInfo.stackId)
        if (targetStackIdx === -1) {
            console.warn('Unable to move card. Target stack is invalid')
            return
        }

        // Note: We need to perform a deep replication of the data for downstream components to detect the exact change
        //       It would be better to use an immutable data library here

        // Remove card from source stack
        const cardStacksCopy = [...this.cardStacks]
        const sourceStackCopy = { ...this.cardStacks[sourceStackIdx] }
        const sourceStackCardsCopy = [...sourceStackCopy.cards]
        const removed = sourceStackCardsCopy.splice(sourceStackInfo.cardIndex, 1)
        if (removed.length !== 1) {
            console.warn('Something went wrong with card removal')
        }
        // Fix the stack indices of cards after removal idx for consistency
        for (let idx = sourceStackInfo.cardIndex; idx < sourceStackCardsCopy.length; idx++) {
            const cardCopy = { ...sourceStackCardsCopy[idx] }
            cardCopy.stackInfo = { stackId: sourceStackInfo.stackId, cardIndex: idx }
            sourceStackCardsCopy[idx] = cardCopy
        }
        sourceStackCopy.cards = sourceStackCardsCopy
        cardStacksCopy[sourceStackIdx] = sourceStackCopy

        // Add card to target stack
        const movingCard = { ...removed[0] }
        movingCard.stackInfo = { ...targetStackInfo }
        const targetStackCopy = { ...this.cardStacks[targetStackIdx] }
        const targetStackCardsCopy = [...targetStackCopy.cards]
        targetStackCardsCopy.splice(targetStackInfo.cardIndex, 0, movingCard)
        targetStackCopy.cards = targetStackCardsCopy
        cardStacksCopy[targetStackIdx] = targetStackCopy

        this.cardStacks = cardStacksCopy
        this.fireModelChange()
    }
}

export const createNewPlayingCardsContextValue = (cardStacks: PlayingCardStackData[]) => new PlayingCardsContextData(cardStacks)
export const PlayingCardsContext = createContext<InstanceType<typeof PlayingCardsContextData>>(createNewPlayingCardsContextValue([]))
export type PlayingCardsContextType = typeof PlayingCardsContextData

export function usePlayingCardsModel() {
    const playingCardsContext = useContext(PlayingCardsContext)
    const [cardStacks, setCardStacks] = useState(playingCardsContext.getCardStacks())

    const handleContextChange = useCallback(() => {
        setCardStacks([...playingCardsContext.getCardStacks()])
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

    const setActiveDrop = useCallback((stackInfo: PlayingCardStackInfo) => {
        playingCardsContext.setActiveDropTarget(stackInfo)
    }, [playingCardsContext])
    const unsetActiveDrop = useCallback((_stackInfo: PlayingCardStackInfo) => {
        playingCardsContext.clearActiveDropTarget()
    }, [playingCardsContext])

    return {
        activeDragCard,
        setActiveDrag,
        setActiveDrop,
        unsetActiveDrop
    }
}
