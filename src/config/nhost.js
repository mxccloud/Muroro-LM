import { NhostClient } from '@nhost/react'

const subdomain = import.meta.env.VITE_NHOST_SUBDOMAIN
const region = import.meta.env.VITE_NHOST_REGION

export const nhost = new NhostClient({
  subdomain: subdomain,
  region: region
})