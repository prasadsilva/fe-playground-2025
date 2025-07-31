import { createContext, type RefObject } from "react"

export class DraggingContextData {
    private canvasRef: RefObject<HTMLElement | null> | undefined
    private trackedObjDragMoveCallback: ((canvasDeltaX: number, canvasDeltaY: number) => void) | undefined
    private trackedObjDragEndCallback: (() => void) | undefined
    private canvasPointerClientX: number
    private canvasPointerClientY: number

    public constructor() {
        this.canvasRef = undefined
        this.trackedObjDragMoveCallback = undefined
        this.trackedObjDragEndCallback = undefined
        this.canvasPointerClientX = -1
        this.canvasPointerClientY = -1
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
        this.clearDragObject()
    }

    public setDragHandler = (onDragMove: (canvasDltaX: number, canvasDeltaY: number) => void, onDragEnd: () => void) => {
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

    }
    public clearDragObject = () => {
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
    }

    public registerCanvas = (canvasRef: RefObject<HTMLElement | null>) => {
        if (this.canvasRef) {
            return
        }
        this.canvasRef = canvasRef
        if (!this.canvasRef.current) {
            console.warn('Unable to register canvas. Current reference is invalid.')
            return
        }
        document.body.addEventListener('pointermove', this.trackCanvasPointer)
    }
    public unregisterCanvas = (_canvasRef: RefObject<HTMLElement | null>) => {
        document.body.removeEventListener('pointermove', this.trackCanvasPointer)
        this.canvasRef = undefined
    }
}
type InstanceType<T extends abstract new (...args: any) => any> = T extends abstract new (...args: any) => infer R ? R : any;

export const createNewDraggingContextValue = () => new DraggingContextData()
export const DraggingContext = createContext<InstanceType<typeof DraggingContextData>>(createNewDraggingContextValue())
export type DraggingContextType = typeof DraggingContextData