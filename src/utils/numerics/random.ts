
export const getRandomInteger = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

export const getRandomFloat = (min: number, max: number): number => {
    return Math.random() * (max - min) + min
}

export const pickRandomItem = <T>(set: T[] | readonly T[]): T => {
    return set[getRandomInteger(0, set.length - 1)]
}