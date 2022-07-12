import { useNavigate, TitleBar, Loading } from '@shopify/app-bridge-react'
import {
  Card,
  EmptyState,
  Layout,
  Page,
  SkeletonBodyText,
} from '@shopify/polaris'

export default function HomePage() {
  const navigate = useNavigate()
  const isLoading = false
  const isRefetching = false
  const QRCodes = []

  /* loadingMarkup uses the loading component from AppBridge and components from Polaris  */
  const loadingMarkup = isLoading ? (
    <Card sectioned>
      <Loading />
      <SkeletonBodyText />
    </Card>
  ) : null

  /* Use Polaris Card and EmptyState components to define the contents of the empty state */
  const emptyStateMarkup =
    !isLoading && !QRCodes?.length ? (
      <Card sectioned>
        <EmptyState
          heading='Create unique QR codes for your product'
          /* This button will take the user to a Create a QR code page */
          action={{
            content: 'Add Videos',
            onAction: () => navigate('/video/addvideo'),
          }}
          image='https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png'
        >
          <p>
            Allow customers to scan codes and buy products using their phones.
          </p>
        </EmptyState>
      </Card>
    ) : null

  return (
    <Page>
      <TitleBar
        title='Videos'
        primaryAction={{
          content: 'Add Video',
          onAction: () => navigate('/video/addvideo'),
        }}
      />
      <Layout>
        <Layout.Section>
          {loadingMarkup}
          {emptyStateMarkup}
        </Layout.Section>
      </Layout>
    </Page>
  )
}
