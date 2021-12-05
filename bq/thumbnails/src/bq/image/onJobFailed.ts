export const onJobFailed = (jobId: string, error: any): void => {
  console.log(`[ JOB ${jobId.padStart(4, '0')} ] [ TQ:IMAGE ] [ FAILED ]`)
  console.log(error)
}
