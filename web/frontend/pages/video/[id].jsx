import { useParams } from 'react-router-dom'
import { Card, Page, Layout, SkeletonBodyText } from '@shopify/polaris'
import { Loading, TitleBar, useAppBridge } from '@shopify/app-bridge-react'
import { AddVideoForm } from '../../components'

export default function addVideoEdit() {
  const { id } = useParams()
  const appBridge = useAppBridge()
  const [savedProduct, setSavedProduct] = React.useState(null)
  const breadcrumbs = [{ content: 'video', url: '/' }]

  /* Loading action and markup that uses App Bridge and Polaris components */
  //   if (isLoading || isRefetching) {
  //     return (
  //       <Page>
  //         <TitleBar
  //           title='Edit QR code'
  //           breadcrumbs={breadcrumbs}
  //           primaryAction={null}
  //         />
  //         <Loading />
  //         <Layout>
  //           <Layout.Section>
  //             <Card sectioned title='Title'>
  //               <SkeletonBodyText lines={2} />
  //             </Card>
  //             <Card title='Product'>
  //               <Card.Section>
  //                 <SkeletonBodyText lines={1} />
  //               </Card.Section>
  //               <Card.Section>
  //                 <SkeletonBodyText lines={3} />
  //               </Card.Section>
  //             </Card>
  //             <Card sectioned title='Discount'>
  //               <SkeletonBodyText lines={2} />
  //             </Card>
  //           </Layout.Section>
  //           <Layout.Section secondary>
  //             <Card sectioned title='QR code' />
  //           </Layout.Section>
  //         </Layout>
  //       </Page>
  //     )
  //   }

  React.useEffect(() => {
    const fetchData = async () => {
      const productList = await JSON.parse(
        localStorage.getItem(`${appBridge.hostOrigin}-product`)
      )
      const data = productList.filter((product) => product.id === id)
      //   console.log(data, 'data-videos')
      setSavedProduct(data[0])
    }
    fetchData()
  }, [])
  //   console.log(savedProduct, 'savedProduct')
  return (
    <Page>
      <TitleBar
        title='Edit Video'
        breadcrumbs={breadcrumbs}
        primaryAction={null}
      />
      <AddVideoForm savedProduct={savedProduct} />
    </Page>
  )
}
