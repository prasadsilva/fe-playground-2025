export class DragManager<T> {
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