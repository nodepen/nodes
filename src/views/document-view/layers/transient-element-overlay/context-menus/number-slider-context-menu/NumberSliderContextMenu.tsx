import React from "react"
import type { ContextMenu } from "../../types"
import type { NumberSliderValueContextMenuContext } from "../../types/ContextMenuContext"
import { useStore } from '$'
import { tryGetSingleValue } from "@/utils/data-trees"
import { usePageSpaceToOverlaySpace } from "@/hooks"

type ContextMenuProps = {
    context: NumberSliderValueContextMenuContext
}

const NumberSliderContextMenu = ({ context }: ContextMenuProps) => {
    const pageSpaceToOverlaySpace = usePageSpaceToOverlaySpace()

    const slider = useStore((state) => state.document.nodes[context.nodeInstanceId])

    const { x, y } = slider.position
    const { dx, dy } = slider.anchors['handle']

    const cx = x + dx
    const cy = y + dy - 24

    const [px, py] = pageSpaceToOverlaySpace(cx, cy)

    const value = tryGetSingleValue(slider.values['output'])?.value

    return (
        <div className="np-absolute np-z-50" style={{ left: px, top: py }}>
            {value}
        </div>
    )
}

export default React.memo(NumberSliderContextMenu)