export const onJobSucceeded = async (
  jobId: string,
  result: any
): Promise<void> => {
  console.log(
    `[ JOB ${jobId.padStart(4, '0')} ] [ METRICS:SOLUTION ] [ SUCCEEDED ]`
  )
}
