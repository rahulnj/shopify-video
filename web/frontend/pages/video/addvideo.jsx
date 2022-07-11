import { Page } from '@shopify/polaris'
import { TitleBar } from '@shopify/app-bridge-react'
import { AddVideoForm } from '../../components/AddVideoForm'

export default function AddVideo() {
  const breadcrumbs = [{ content: 'Videos', url: '/' }]

  return (
    <Page>
      <TitleBar
        title='Add new video'
        breadcrumbs={breadcrumbs}
        primaryAction={null}
      />
      <AddVideoForm />
    </Page>
  )
}
