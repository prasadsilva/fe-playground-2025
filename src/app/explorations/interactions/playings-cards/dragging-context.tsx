import { createContext, type RefObject } from "react"

export class DraggingContextData {
    private canvasRef: RefObject<HTMLElement | null> | undefined
    private trackedObjRef: RefObject<HTMLElement | null> | undefined
    private trackedObjDragMoveCallback: ((e: PointerEvent) => void) | undefined
    private dragOffsetX: number
    private dragOffsetY: number
    // private lastPointerClientX: number
    // private lastPointerClientY: number

    public constructor() {
        console.log('ctor')
        this.canvasRef = undefined
        this.trackedObjRef = undefined
        this.trackedObjDragMoveCallback = undefined
        this.dragOffsetX = -1
        this.dragOffsetY = -1
        // this.targetX = -1
        // this.targetY = -1
        // this.lastPointerClientX = -1
        // this.lastPointerClientY = -1
    }

    private handlePointerMove = (e: PointerEvent) => {
        if (!this.trackedObjRef || !this.trackedObjRef.current) return;
        console.log(`pointer move for -> ${this.trackedObjRef.current.getAttribute('id')}`);
        if (!this.trackedObjDragMoveCallback) return;
        this.trackedObjDragMoveCallback(e)

        // const deltaX = e.clientX - this.lastPointerClientX
        // const deltaY = e.clientY - this.lastPointerClientY
        // const element = this.trackedObjRef.current
        // this.trackedObjRef.current.style.left = `${e.clientX - this.dragOffsetX}px`
        // this.trackedObjRef.current.style.top = `${e.clientX - this.dragOffsetY}px`
        // element.style.translate = `${deltaX}px ${deltaY}px`
        // this.lastPointerClientX = e.clientX
        // this.lastPointerClientY = e.clientY
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

        // this.lastPointerClientX = pointerClientX
        // this.lastPointerClientY = pointerClientY
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

export const createNewDraggingContextValue = () => new DraggingContextData()
export const DraggingContext = createContext<InstanceType<typeof DraggingContextData>>(createNewDraggingContextValue())
export type DraggingContextType = typeof DraggingContextData