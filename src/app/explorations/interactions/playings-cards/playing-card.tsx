import { useMemo, type ComponentProps } from "react"
import { OPlayingCardStackBehavior, type PlayingCanvasPosition, type PlayingCardStackData, type PlayingCardStackInfo } from "./types"
import { PlayingCardsHooks } from "./playing-cards-context";
import type { Immutable } from "@/lib/types";
import { PlayingCardDropTarget } from "./playing-card-drop-target";
import { CARD_DIMS_CLASS, LAYOUT_CONSTANTS } from "./constants";
import { cn } from "@/lib/utils";


export type PlayingCardProps = Immutable<{
    cardStack: PlayingCardStackData,
    stackInfo: PlayingCardStackInfo,
    position: PlayingCanvasPosition,
    isPreviousSiblingBeingDragged?: boolean
}> & ComponentProps<'div'>
export function PlayingCard({ cardStack, stackInfo, position, isPreviousSiblingBeingDragged, ...props }: PlayingCardProps) {
    const { draggableRef, isBeingDragged, currentPosition } = PlayingCardsHooks.useDraggable(stackInfo, position)

    // TODO: These could be moved into the hook?
    const isInDraggedState = useMemo(() =>
        (cardStack.behavior === OPlayingCardStackBehavior.MoveAllNextSiblings && isPreviousSiblingBeingDragged) || isBeingDragged,
        [isPreviousSiblingBeingDragged, isBeingDragged]
    )
    const positionForSiblingLayout = cardStack.behavior === OPlayingCardStackBehavior.MoveAllNextSiblings ? currentPosition : position
    const nextSiblingPosition = useMemo<PlayingCanvasPosition>(() =>
        ({ x: positionForSiblingLayout.x, y: positionForSiblingLayout.y + LAYOUT_CONSTANTS.STACKED_CARD_Y_OFFSET }),
        [positionForSiblingLayout]
    )

    return (
        <>
            <div
                {...props}
                ref={draggableRef}
                className="absolute size-fit"
                style={{
                    transform: `translateX(${currentPosition.x}px) translateY(${currentPosition.y}px)`,
                    zIndex: isInDraggedState ? stackInfo.cardIndex + LAYOUT_CONSTANTS.DRAG_Z_INDEX_OFFSET : stackInfo.cardIndex,
                    pointerEvents: isInDraggedState ? 'none' : 'auto'
                }}
            >
                <img src={cardStack.cards[stackInfo.cardIndex].cardImg} className={cn("", CARD_DIMS_CLASS)} draggable={false} />
            </div>
            <PlayingCardHolder
                cardStack={cardStack}
                stackInfo={{ ...stackInfo, cardIndex: stackInfo.cardIndex + 1 }}
                position={nextSiblingPosition}
                isPreviousSiblingBeingDragged={isInDraggedState}
            />
        </>
    )
}

export function PlayingCardHolder({ cardStack, stackInfo, position, isPreviousSiblingBeingDragged, ...props }: PlayingCardProps) {
    const droptargetStackInfo = useMemo(() => ({ ...stackInfo, cardIndex: cardStack.cards.length }), [cardStack.cards])
    const droptargetPosition = useMemo(() => ({ x: cardStack.position.x, y: cardStack.position.y + (cardStack.cards.length * LAYOUT_CONSTANTS.STACKED_CARD_Y_OFFSET) }), [cardStack.position, cardStack.cards])
    return (
        stackInfo.cardIndex < cardStack.cards.length ?
            <PlayingCard {...props} cardStack={cardStack} stackInfo={stackInfo} position={position} isPreviousSiblingBeingDragged={isPreviousSiblingBeingDragged} /> :
            (cardStack.hasDropTarget &&
                <PlayingCardDropTarget
                    stackInfo={droptargetStackInfo}
                    position={droptargetPosition}
                />)
    )
}