import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type JSX } from "react"
import { OPlayingCardStackBehavior, type PlayingCanvasPosition, type PlayingCardStackData, type PlayingCardStackInfo } from "./types"
import type { Immutable } from "@/lib/types"
import { deepFreeze } from "@/lib/utils"
import { DragManager } from "./dragmanager"
import { createPortal } from "react-dom"

type PlayingCardsContextChangeListener = (modelChanged: boolean) => void

class PlayingCardsContextData {
    private cardStacks: Immutable<PlayingCardStackData[]>
    private changeListeners: Set<PlayingCardsContextChangeListener>
    private dragManager: DragManager<PlayingCardStackInfo>
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

    public setActiveDragHandler(dragData: PlayingCardStackInfo, onDragMove: ((canvasDeltaX: number, canvasDeltaY: number) => void), onDragEnd: (() => void)) {
        this.dragManager.setActiveDragHandler(dragData, onDragMove, onDragEnd)
    }
    public addDragStateChangeListener(callback: (stackInfo: PlayingCardStackInfo | null) => void) {
        this.dragManager.addDragStateChangeListener(callback)
    }
    public removeDragStateChangeListener(callback: (stackInfo: PlayingCardStackInfo | null) => void) {
        this.dragManager.removedragStateChangeListener(callback)
    }

    public setActiveDropTarget(stackInfo: PlayingCardStackInfo) {
        this.activeDropTarget = stackInfo
    }
    public clearActiveDropTarget() {
        this.activeDropTarget = null
    }
    private tryHandleDrop(stackInfo: PlayingCardStackInfo) {
        if (this.activeDropTarget) {
            this.moveBetweenStacks(stackInfo, this.activeDropTarget)
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
        const sourceStackIdx = sourceStackInfo.stackIndex
        if (sourceStackIdx === -1) {
            console.warn('Unable to move card. Source stack is invalid')
            return
        }
        const targetStackIdx = targetStackInfo.stackIndex
        if (targetStackIdx === -1) {
            console.warn('Unable to move card. Target stack is invalid')
            return
        }

        // Note: We need to perform a deep replication of the data for downstream components to detect the exact change
        //       It would be better to use an immutable data library here
        const cardStacksCopy = [...this.cardStacks]

        switch (this.cardStacks[sourceStackInfo.stackIndex].behavior) {
            case OPlayingCardStackBehavior.MoveAllNextSiblings: {
                // Remove card and next siblings below from source stack
                const sourceStackCopy = { ...this.cardStacks[sourceStackIdx] }
                const sourceStackCardsCopy = sourceStackCopy.cards.slice(0, sourceStackInfo.cardIndex)
                const cardsToMove = sourceStackCopy.cards.slice(sourceStackInfo.cardIndex)
                if (sourceStackCardsCopy.length === sourceStackCopy.cards.length) {
                    console.warn('Something went wrong with card removal')
                }
                sourceStackCopy.cards = sourceStackCardsCopy
                cardStacksCopy[sourceStackIdx] = sourceStackCopy

                // Add card and next siblings to target stack
                const targetStackCopy = { ...this.cardStacks[targetStackIdx] }
                const targetStackCardsCopy = [...targetStackCopy.cards]
                targetStackCardsCopy.splice(targetStackInfo.cardIndex, 0, ...cardsToMove)
                targetStackCopy.cards = targetStackCardsCopy
                cardStacksCopy[targetStackIdx] = targetStackCopy

                break
            }
            case OPlayingCardStackBehavior.MoveIndividually: {
                // Remove only the one card from source stack
                const sourceStackCopy = { ...this.cardStacks[sourceStackIdx] }
                const sourceStackCardsCopy = [...sourceStackCopy.cards]
                const cardsToMove = sourceStackCardsCopy.splice(sourceStackInfo.cardIndex, 1)
                if (sourceStackCardsCopy.length === sourceStackCopy.cards.length) {
                    console.warn('Something went wrong with card removal')
                }
                sourceStackCopy.cards = sourceStackCardsCopy
                cardStacksCopy[sourceStackIdx] = sourceStackCopy

                // Add the one card to the target stack
                const targetStackCopy = { ...this.cardStacks[targetStackIdx] }
                const targetStackCardsCopy = [...targetStackCopy.cards]
                targetStackCardsCopy.splice(targetStackInfo.cardIndex, 0, ...cardsToMove)
                targetStackCopy.cards = targetStackCardsCopy
                cardStacksCopy[targetStackIdx] = targetStackCopy

                break
            }
        }


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
    const [activeDragInfo, setActiveDragInfo] = useState<PlayingCardStackInfo | null>(null)

    const handleActiveDragChange = useCallback((stackInfo: PlayingCardStackInfo | null) => {
        setActiveDragInfo(stackInfo)
    }, [])

    useEffect(() => {
        playingCardsContext.addDragStateChangeListener(handleActiveDragChange)
        return () => playingCardsContext.removeDragStateChangeListener(handleActiveDragChange)
    }, [playingCardsContext])

    const setActiveDrag = useCallback((stackInfo: PlayingCardStackInfo, onDragMove: ((canvasDeltaX: number, canvasDeltaY: number) => void), onDragEnd: (() => void)) => {
        playingCardsContext.setActiveDragHandler(stackInfo, onDragMove, onDragEnd)
    }, [playingCardsContext])

    const setActiveDrop = useCallback((stackInfo: PlayingCardStackInfo) => {
        playingCardsContext.setActiveDropTarget(stackInfo)
    }, [playingCardsContext])
    const unsetActiveDrop = useCallback((_stackInfo: PlayingCardStackInfo) => {
        playingCardsContext.clearActiveDropTarget()
    }, [playingCardsContext])

    return {
        activeDragInfo,
        setActiveDrag,
        setActiveDrop,
        unsetActiveDrop
    }
}

function useDropTarget(stackInfo: Immutable<PlayingCardStackInfo>) {
    const dropTargetRef = useRef<HTMLDivElement>(null)
    const { activeDragInfo, setActiveDrop, unsetActiveDrop } = useDragManager()
    const [isDragCardOver, setIsDragCardOver] = useState(false)

    const isActivated = useMemo(() => {
        return activeDragInfo && activeDragInfo.stackIndex !== stackInfo.stackIndex
    }, [activeDragInfo, stackInfo])

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
        if (!activeDragInfo) {
            setIsDragCardOver(false)
        }
    }, [activeDragInfo])

    return {
        dropTargetRef,
        isActivated,
        isDragOver: isDragCardOver
    }
}

function useDraggable(stackInfo: Immutable<PlayingCardStackInfo>, position: PlayingCanvasPosition) {
    const { setActiveDrag } = PlayingCardsHooks.useDragManager()

    // Track internal position separtely to allow for uncontrolled positioning while being dragged
    const [currentPosition, setCurrentPosition] = useState({
        x: position.x,
        y: position.y
    });
    const resetInternalPosition = useCallback(() => {
        setCurrentPosition(position)
    }, [position])
    const handleDrag = useCallback((canvasDeltaX: number, canvasDeltaY: number) => {
        setCurrentPosition(prev => ({
            x: prev.x + canvasDeltaX,
            y: prev.y + canvasDeltaY
        }))
    }, [])
    const handleEndDrag = useCallback(() => {
        setIsBeingDragged(false)
        resetInternalPosition()
    }, [resetInternalPosition])

    const [isBeingDragged, setIsBeingDragged] = useState(false)

    const draggableRef = useCallback((node: HTMLDivElement | null) => {
        if (node) {
            const handlePointerDown = (e: PointerEvent) => {
                // https://stackoverflow.com/a/70737325/2847817
                if (node.hasPointerCapture(e.pointerId)) {
                    node.releasePointerCapture(e.pointerId);
                }
                setIsBeingDragged(true)
                setActiveDrag(stackInfo, handleDrag, handleEndDrag)
            }

            node.addEventListener('pointerdown', handlePointerDown)
            return () => {
                node.removeEventListener('pointerdown', handlePointerDown)
            }
        }
    }, [])

    // Reset the internal position if param changes
    useEffect(() => {
        resetInternalPosition()
    }, [position])

    return {
        draggableRef,
        isBeingDragged,
        currentPosition
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