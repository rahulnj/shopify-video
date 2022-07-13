import {
  useNavigate,
  TitleBar,
  Loading,
  useAppBridge,
} from '@shopify/app-bridge-react'
import {
  Card,
  EmptyState,
  Layout,
  Page,
  SkeletonBodyText,
} from '@shopify/polaris'
import { useEffect, useState } from 'react'
import { ProductListIndex } from '../components'

export default function HomePage() {
  const appBridge = useAppBridge()
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const isLoading = false
  const isRefetching = false

  useEffect(() => {
    const ProductList = JSON.parse(
      localStorage.getItem(`${appBridge.hostOrigin}-product`)
    )
    setProducts(ProductList)
  }, [])
  console.log(products, 'products')

  const productsMarkup = products?.length ? (
    <ProductListIndex products={products} loading={false} />
  ) : null

  /* loadingMarkup uses the loading component from AppBridge and components from Polaris  */
  const loadingMarkup = isLoading ? (
    <Card sectioned>
      <Loading />
      <SkeletonBodyText />
    </Card>
  ) : null

  /* Use Polaris Card and EmptyState components to define the contents of the empty state */
  const emptyStateMarkup =
    !isLoading && !products?.length ? (
      <Card sectioned>
        <EmptyState
          heading='Create unique videos for your product'
          /* This button will take the user to a Create a QR code page */
          action={{
            content: 'Add Video',
            onAction: () => navigate('/video/addvideo'),
          }}
          image='https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png'
        >
          <p>Allow customers to watch videos and buy products.</p>
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
          {productsMarkup}
          {emptyStateMarkup}
        </Layout.Section>
      </Layout>
    </Page>
  )
}
