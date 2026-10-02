import type { UNITS } from "@/constants"

export type DocumentUnits = keyof typeof UNITS

export type DocumentSettings = {
    units: DocumentUnits
}
