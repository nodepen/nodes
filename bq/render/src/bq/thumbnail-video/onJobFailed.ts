export const onJobFailed = (jobId: string, error: any): void => {
  console.log(
    `[ JOB ${jobId.padStart(4, '0')} ] [ RQ:THUMBNAIL-VID ] [ FAILED ]`
  )
  console.log(error)
}
