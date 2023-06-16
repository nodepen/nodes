// Courtesy of github user `thsig` 🙏
// https://github.com/thsig/jaro-winkler-JS/blob/master/jaro_winkler.js

export const jaroWinklerDistance = (a: string, b: string) => {
  if (!a || !b) {
    return 0.0
  }

  a = a.trim().toUpperCase()
  b = b.trim().toUpperCase()
  const a_len = a.length
  const b_len = b.length
  const a_flag = []
  const b_flag = []
  const search_range = Math.floor(Math.max(a_len, b_len) / 2) - 1
  const minv = Math.min(a_len, b_len)

  // Looking only within the search range, count and flag the matched pairs.
  let Num_com = 0
  const yl1 = b_len - 1
  for (let i = 0; i < a_len; i++) {
    const lowlim = i >= search_range ? i - search_range : 0
    const hilim = i + search_range <= yl1 ? i + search_range : yl1
    for (let j = lowlim; j <= hilim; j++) {
      if (b_flag[j] !== 1 && a[j] === b[i]) {
        a_flag[j] = 1
        b_flag[i] = 1
        Num_com++
        break
      }
    }
  }

  // Return if no characters in common
  if (Num_com === 0) {
    return 0.0
  }

  // Count the number of transpositions
  let k = 0
  let N_trans = 0
  for (let i = 0; i < a_len; i++) {
    if (a_flag[i] === 1) {
      let j
      for (j = k; j < b_len; j++) {
        if (b_flag[j] === 1) {
          k = j + 1
          break
        }
      }
      if (a[i] !== b[j]) {
        N_trans++
      }
    }
  }
  N_trans = Math.floor(N_trans / 2)

  // Adjust for similarities in nonmatched characters
  let N_simi = 0
  const adjwt = adjustments
  if (minv > Num_com) {
    for (let i = 0; i < a_len; i++) {
      if (!a_flag[i]) {
        for (let j = 0; j < b_len; j++) {
          if (!b_flag[j]) {
            if (adjwt[a[i]] === b[j]) {
              N_simi += 3
              b_flag[j] = 2
              break
            }
          }
        }
      }
    }
  }

  const Num_sim = N_simi / 10.0 + Num_com

  // Main weight computation
  let weight = Num_sim / a_len + Num_sim / b_len + (Num_com - N_trans) / Num_com
  weight = weight / 3

  // Continue to boost the weight if the strings are similar
  if (weight > 0.7) {
    // Adjust for having up to the first 4 characters in common
    const j = minv >= 4 ? 4 : minv
    let i
    for (i = 0; i < j && a[i] === b[i]; i++) {
      // Empty block
    }
    if (i) {
      weight += i * 0.1 * (1.0 - weight)
    }

    // Adjust for long strings.
    // After agreeing beginning chars, at least two more must agree
    // and the agreeing characters must be more than half of the
    // remaining characters.
    if (minv > 4 && Num_com > i + 1 && 2 * Num_com >= minv + i) {
      weight += (1 - weight) * ((Num_com - i - 1) / (a_len * b_len - i * 2 + 2))
    }
  }

  return weight
}

// The char adjustment table used above
const adjustments: Record<string, string> = {
  A: 'E',
  // @ts-expect-error Algorithm expects duplicate keys
  A: 'I',
  // @ts-expect-error Algorithm expects duplicate keys
  A: 'O',
  // @ts-expect-error Algorithm expects duplicate keys
  A: 'U',
  B: 'V',
  E: 'I',
  // @ts-expect-error Algorithm expects duplicate keys
  E: 'O',
  // @ts-expect-error Algorithm expects duplicate keys
  E: 'U',
  I: 'O',
  // @ts-expect-error Algorithm expects duplicate keys
  I: 'U',
  O: 'U',
  // @ts-expect-error Algorithm expects duplicate keys
  I: 'Y',
  // @ts-expect-error Algorithm expects duplicate keys
  E: 'Y',
  C: 'G',
  // @ts-expect-error Algorithm expects duplicate keys
  E: 'F',
  W: 'U',
  // @ts-expect-error Algorithm expects duplicate keys
  W: 'V',
  X: 'K',
  S: 'Z',
  // @ts-expect-error Algorithm expects duplicate keys
  X: 'S',
  Q: 'C',
  U: 'V',
  M: 'N',
  L: 'I',
  // @ts-expect-error Algorithm expects duplicate keys
  Q: 'O',
  P: 'R',
  // @ts-expect-error Algorithm expects duplicate keys
  I: 'J',
  '2': 'Z',
  '5': 'S',
  '8': 'B',
  '1': 'I',
  // @ts-expect-error Algorithm expects duplicate keys
  '1': 'L',
  '0': 'O',
  // @ts-expect-error Algorithm expects duplicate keys
  '0': 'Q',
  // @ts-expect-error Algorithm expects duplicate keys
  C: 'K',
  G: 'J',
  // @ts-expect-error Algorithm expects duplicate keys
  E: ' ',
  Y: ' ',
  // @ts-expect-error Algorithm expects duplicate keys
  S: ' ',
}
