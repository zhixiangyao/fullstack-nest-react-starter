/**
 *
 * ```ts
 *   const color = randomColor(3229)
 *   console.log(num) // '#c9d'
 * ```
 */
export function randomColor(randomNumber: number) {
  const hexString = randomNumber.toString(16)

  return `#${hexString}`
}
