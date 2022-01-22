export const onJobFailed = (jobId: string, error: any): void => {
  console.log(`[ JOB ${jobId.padStart(4, '0')} ] [ SOLVE ] [ FAILED ]`)
  console.log(error)
}
