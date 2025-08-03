import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type JSX } from "react"
import type { PlayingCardData, PlayingCardStackData, PlayingCardStackInfo } from "./types"
import type { Immutable } from "@/lib/types"
import { deepFreeze } from "@/lib/utils"
import { DragManager } from "./dragmanager"
import { createPortal } from "react-dom"

type PlayingCardsContextChangeListener = (modelChanged: boolean) => void

class PlayingCardsContextData {
    private cardStacks: Immutable<PlayingCardStackData[]>
    private changeListeners: Set<PlayingCardsContextChangeListener>
    private dragManager: DragManager<PlayingCardData>
    private activeDropTarget: PlayingCardStackInfo | null
    private canvasElement: HTMLElement | null

    public constructor(cardStacksParam: PlayingCardStackData[]) {
        this.cardStacks = deepFreeze(cardStacksParam)
        this.changeListeners = new Set
        this.dragManager = new DragManager((card) => this.tryHandleDrop(card))
        this.activeDropTarget = null
        this.canvasElement = null
    }

    public getCanvas() {
        return this.canvasElement
    }
    public setCanvas(canvas: HTMLElement | null) {
        this.canvasElement = canvas
    }

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
            this.notifyContextStateChange(true)
        } else {
            this.notifyContextStateChange(false)
        }
        this.clearActiveDropTarget()
    }

    public addChangeListener(callback: PlayingCardsContextChangeListener) {
        this.changeListeners.add(callback)
    }
    public removeChangeListener(callback: PlayingCardsContextChangeListener) {
        this.changeListeners.delete(callback)
    }
    private notifyContextStateChange(modelChanged: boolean) {
        this.changeListeners.forEach(callback => callback(modelChanged))
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
        const cardStacksCopy = [...this.cardStacks]

        // Remove card and siblings below from source stack
        const sourceStackCopy = { ...this.cardStacks[sourceStackIdx] }
        const sourceStackCardsCopy = sourceStackCopy.cards.slice(0, sourceStackInfo.cardIndex)
        const cardsToMove = sourceStackCopy.cards.slice(sourceStackInfo.cardIndex)
        if (sourceStackCardsCopy.length === sourceStackCopy.cards.length) {
            console.warn('Something went wrong with card removal')
        }
        sourceStackCopy.cards = sourceStackCardsCopy
        cardStacksCopy[sourceStackIdx] = sourceStackCopy

        // Add card to target stack
        const targetStackCopy = { ...this.cardStacks[targetStackIdx] }
        const targetStackCardsCopy = [...targetStackCopy.cards]
        targetStackCardsCopy.splice(targetStackInfo.cardIndex, 0, ...cardsToMove)
        for (let idx = 0; idx < targetStackCardsCopy.length; idx++) {
            const cardCopy = { ...targetStackCardsCopy[idx] }
            cardCopy.stackInfo = { stackId: targetStackInfo.stackId, cardIndex: idx }
            targetStackCardsCopy[idx] = cardCopy
        }
        targetStackCopy.cards = targetStackCardsCopy
        cardStacksCopy[targetStackIdx] = targetStackCopy

        this.cardStacks = cardStacksCopy
    }
}

export const createNewPlayingCardsContextValue = (cardStacks: PlayingCardStackData[]) => new PlayingCardsContextData(cardStacks)
export const PlayingCardsContext = createContext<InstanceType<typeof PlayingCardsContextData>>(createNewPlayingCardsContextValue([]))
export type PlayingCardsContextType = typeof PlayingCardsContextData

function useModel() {
    const playingCardsContext = useContext(PlayingCardsContext)
    const [cardStacks, setCardStacks] = useState(playingCardsContext.getCardStacks())

    const handleContextChange = useCallback((modelChanged: boolean) => {
        if (modelChanged) {
            setCardStacks(playingCardsContext.getCardStacks())
        } else {
            // We are here because of an aborted drop. Reset the state to cause a re-render
            setCardStacks([...playingCardsContext.getCardStacks()])
        }
    }, [playingCardsContext])

    useEffect(() => {
        playingCardsContext.addChangeListener(handleContextChange);
        return () => playingCardsContext.removeChangeListener(handleContextChange)
    }, [playingCardsContext])

    return {
        cardStacks
    }
}

function useDragManager() {
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

function useDropTarget(stackInfo: Immutable<PlayingCardStackInfo>) {
    const dropTargetRef = useRef<HTMLDivElement>(null)
    const { activeDragCard, setActiveDrop, unsetActiveDrop } = useDragManager()
    const [isDragCardOver, setIsDragCardOver] = useState(false)

    const isActivated = useMemo(() => {
        return activeDragCard && activeDragCard.stackInfo.stackId !== stackInfo.stackId
    }, [activeDragCard, stackInfo])

    // TODO: Change to ref callback?
    useEffect(() => {
        const element = dropTargetRef.current
        if (element) {
            const handlePointerEnter = () => {
                if (isActivated) {
                    setIsDragCardOver(true)
                    setActiveDrop(stackInfo)
                }
            }
            const handlePointerLeave = () => {
                if (isActivated) {
                    setIsDragCardOver(false)
                    unsetActiveDrop(stackInfo)
                }
            }

            element.addEventListener('pointerenter', handlePointerEnter)
            element.addEventListener('pointerleave', handlePointerLeave)
            return () => {
                element.removeEventListener('pointerenter', handlePointerEnter)
                element.removeEventListener('pointerleave', handlePointerLeave)
            }
        }
    }, [dropTargetRef.current, isActivated, stackInfo])

    useEffect(() => {
        if (!activeDragCard) {
            setIsDragCardOver(false)
        }
    }, [activeDragCard])

    return {
        dropTargetRef,
        isActivated,
        isDragOver: isDragCardOver
    }
}

function useDraggable(card: Immutable<PlayingCardData>, onDrag: (canvasDeltaX: number, canvasDeltaY: number) => void, onDragEnd: () => void) {
    const draggableRef = useCallback((node: HTMLDivElement | null) => {
        if (node) {
            const handlePointerDown = () => {
                setIsBeingDragged(true)
                setActiveDrag(card, onDrag, handleEndDrag)
            }

            node.addEventListener('pointerdown', handlePointerDown)
            return () => {
                node.removeEventListener('pointerdown', handlePointerDown)
            }
        }
    }, [])

    const [isBeingDragged, setIsBeingDragged] = useState(false)
    const { setActiveDrag } = PlayingCardsHooks.useDragManager()

    const handleEndDrag = useCallback(() => {
        setIsBeingDragged(false)
        onDragEnd()
    }, [onDragEnd])

    return {
        draggableRef,
        isBeingDragged
    }
}

function useCanvas() {
    const playingCardsContext = useContext(PlayingCardsContext)
    const [isCanvasAvailable, setIsCanvasAvailable] = useState(false)
    const canvasRef = useCallback((node: HTMLDivElement | null) => {
        if (playingCardsContext.getCanvas() && node) {
            console.warn('Unable to register canvas element. A canvas is already registered.')
            return
        }
        playingCardsContext.setCanvas(node)
        setIsCanvasAvailable(node !== null)
    }, [])

    const createCanvasPortal = (node: JSX.Element) => {
        const canvas = playingCardsContext.getCanvas()
        if (canvas !== null) {
            return createPortal(node, canvas)
        }
        return null
    }

    return {
        canvasRef,
        isCanvasAvailable,
        createCanvasPortal
    }
}

export const PlayingCardsHooks = {
    useModel,
    useDragManager,
    useDropTarget,
    useDraggable,
    useCanvas
}