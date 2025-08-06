interface DropTargetData<T> {
    element: HTMLElement
    data: T
    onEnter?: (data: T) => void
    onLeave?: (data: T) => void
}

export class DragManager<T> {
    private trackedObjDragMoveCallback: ((canvasDeltaX: number, canvasDeltaY: number) => void) | undefined
    private trackedObjDragEndCallback: (() => void) | undefined
    private canvasPointerClientX: number
    private canvasPointerClientY: number
    private usageCount: number
    private currentDragData: T | null
    private dragStateChangeListeners: Set<(dragCard: T | null) => void>
    private dropCallback: (dragData: T) => void | null
    private canvasElement: HTMLElement | null
    private dropTargetRegistry: Map<HTMLElement, DropTargetData<T>>
    private currentDropTarget: DropTargetData<T> | null

    public constructor(dropCallback: typeof this.dropCallback) {
        this.trackedObjDragMoveCallback = undefined
        this.trackedObjDragEndCallback = undefined
        this.canvasPointerClientX = -1
        this.canvasPointerClientY = -1
        this.usageCount = 0
        this.currentDragData = null
        this.dragStateChangeListeners = new Set
        this.dropCallback = dropCallback
        this.canvasElement = null
        this.dropTargetRegistry = new Map()
        this.currentDropTarget = null
    }

    private touchInterceptor = (e: TouchEvent) => {
        // Only prevent default touch behavior if we're actively dragging
        if (this.isActivelyDragging()) {
            e.preventDefault()
        }
    }

    private setDragData(dragData: T | null) {
        this.currentDragData = dragData
        this.dragStateChangeListeners.forEach(callback => callback(this.currentDragData))
    }

    public setCanvasElement(canvas: HTMLElement | null) {
        // Handle touch prevention for the current canvas element
        const currentCanvas = this.getCanvasElement()
        if (currentCanvas) {
            currentCanvas.removeEventListener('touchstart', this.touchInterceptor)
            currentCanvas.removeEventListener('touchmove', this.touchInterceptor)
        }
        
        // Update canvas element
        this.canvasElement = canvas
        
        // Add touch prevention to the new canvas element
        if (canvas) {
            canvas.addEventListener('touchstart', this.touchInterceptor)
            canvas.addEventListener('touchmove', this.touchInterceptor)
        }
    }

    public getCanvasElement(): HTMLElement | null {
        return this.canvasElement
    }

    public registerDropTarget(element: HTMLElement, data: T, onEnter?: (data: T) => void, onLeave?: (data: T) => void) {
        this.dropTargetRegistry.set(element, { element, data, onEnter, onLeave })
    }

    public unregisterDropTarget(element: HTMLElement) {
        const dropTarget = this.dropTargetRegistry.get(element)
        if (dropTarget && this.currentDropTarget === dropTarget) {
            this.handleDropTargetLeave()
        }
        this.dropTargetRegistry.delete(element)
    }

    private handleDropTargetEnter(dropTarget: DropTargetData<T>) {
        if (this.currentDropTarget) {
            this.handleDropTargetLeave()
        }
        this.currentDropTarget = dropTarget
        if (dropTarget.onEnter) {
            dropTarget.onEnter(dropTarget.data)
        }
    }

    private handleDropTargetLeave() {
        if (this.currentDropTarget?.onLeave) {
            this.currentDropTarget.onLeave(this.currentDropTarget.data)
        }
        this.currentDropTarget = null
    }

    private findDropTargetAtPoint(x: number, y: number): DropTargetData<T> | null {
        const elementAtPoint = document.elementFromPoint(x, y)
        if (!elementAtPoint) return null

        // Check if the element itself is a drop target
        for (const [element, dropTarget] of this.dropTargetRegistry) {
            if (element === elementAtPoint || element.contains(elementAtPoint)) {
                return dropTarget
            }
        }
        return null
    }

    public addDragStateChangeListener(callback: (dragCard: T | null) => void) {
        this.dragStateChangeListeners.add(callback)
        this.usageCount++
    }
    public removedragStateChangeListener(callback: (dragCard: T | null) => void) {
        this.dragStateChangeListeners.delete(callback)
        this.usageCount--
    }

    private trackCanvasPointer = (e: PointerEvent) => {
        const deltaX = e.clientX - this.canvasPointerClientX
        const deltaY = e.clientY - this.canvasPointerClientY
        if (this.trackedObjDragMoveCallback) {
            this.trackedObjDragMoveCallback(deltaX, deltaY)
        }
        this.canvasPointerClientX = e.clientX
        this.canvasPointerClientY = e.clientY

        // Only check for drop targets during an active drag
        if (this.currentDragData) {
            const dropTargetAtPoint = this.findDropTargetAtPoint(e.clientX, e.clientY)
            
            if (dropTargetAtPoint !== this.currentDropTarget) {
                if (this.currentDropTarget) {
                    this.handleDropTargetLeave()
                }
                if (dropTargetAtPoint) {
                    this.handleDropTargetEnter(dropTargetAtPoint)
                }
            }
        }
    }

    private registerPointerReleaseCallbacks = () => {
        document.body.addEventListener('pointermove', this.trackCanvasPointer)
        document.body.addEventListener('pointerup', this.handlePointerReleaseNative)
        document.body.addEventListener('pointerleave', this.handlePointerInvalidNative)
        document.body.addEventListener('pointercancel', this.handlePointerInvalidNative)
    }

    private unregisterPointerReleaseCallbacks = () => {
        document.body.removeEventListener('pointermove', this.trackCanvasPointer)
        document.body.removeEventListener('pointerup', this.handlePointerReleaseNative)
        document.body.removeEventListener('pointerleave', this.handlePointerInvalidNative)
        document.body.removeEventListener('pointercancel', this.handlePointerInvalidNative)
    }

    private handlePointerReleaseNative = () => {
        if (this.currentDragData) {
            this.dropCallback(this.currentDragData)
        }
        this.clearActiveDragHandler()
    }
    private handlePointerInvalidNative = () => {
        this.clearActiveDragHandler()
    }

    public getCurrentDropTarget(): T | null {
        return this.currentDropTarget?.data || null
    }

    public isActivelyDragging(): boolean {
        return this.currentDragData !== null
    }

    public setActiveDragHandler = (
        dragData: T,
        dragStartClientX: number,
        dragStartClientY: number,
        onDragMove: (canvasDltaX: number, canvasDeltaY: number) => void,
        onDragEnd: () => void
    ) => {
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

        // For touchscreens the originating point is instantaenous. We need to capture those values as soon as possible.
        this.canvasPointerClientX = dragStartClientX
        this.canvasPointerClientY = dragStartClientY
    }
    public clearActiveDragHandler = () => {
        // Not dragging - bail
        if (!this.trackedObjDragMoveCallback) {
            console.warn('Unable to clear drag object. Not currently dragging an element.')
            return
        }

        // Clear drop target state
        if (this.currentDropTarget) {
            this.handleDropTargetLeave()
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