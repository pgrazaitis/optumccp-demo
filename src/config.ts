/** Runtime configuration. Values are baked in at build time by Vite.
 *  For per-environment builds without rebuilding, you can instead serve a
 *  /config.json from S3 and fetch it at startup — see README. */
export const appConfig = {
  /** Amazon Connect CCP v2 URL, e.g. https://my-instance.my.connect.aws/ccp-v2/ */
  ccpUrl: (import.meta.env.VITE_CONNECT_CCP_URL as string | undefined)?.trim() ?? '',
  region: (import.meta.env.VITE_CONNECT_REGION as string | undefined)?.trim() || 'us-east-1',
  get isLiveMode(): boolean {
    return this.ccpUrl.length > 0;
  },
};
