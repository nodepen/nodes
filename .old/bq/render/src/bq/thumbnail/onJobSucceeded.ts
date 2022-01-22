export const onJobSucceeded = async (jobId: string): Promise<void> => {
  console.log(
    `[ JOB ${jobId.padStart(4, '0')} ] [ RQ:THUMBNAIL ] [ SUCCEEDED ]`
  )
}
