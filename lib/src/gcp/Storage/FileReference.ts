export type FileReference = {
  bucket: string
  path: string
  url: string
  /**
   * TTL in days. Will be refreshed on fetch if necessary.
   */
  ttl: number
  updated: string
}