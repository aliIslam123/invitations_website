import React from 'react'
import { prisma } from '@/lib/db'
import { MediaLibraryManager } from '@/components/dashboard/MediaLibraryManager'

export default async function MediaPage() {
  const assets = await prisma.mediaAsset.findMany({
    orderBy: { createdAt: 'desc' },
  })

  const serializedAssets = JSON.parse(JSON.stringify(assets))

  return <MediaLibraryManager initialAssets={serializedAssets} />
}
