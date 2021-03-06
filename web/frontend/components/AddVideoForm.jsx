import { useState, useCallback } from 'react'
import {
  Banner,
  Card,
  Form,
  FormLayout,
  TextField,
  Select,
  Stack,
  Layout,
  EmptyState,
  List,
} from '@shopify/polaris'
import {
  ContextualSaveBar,
  useAppBridge,
  useNavigate,
} from '@shopify/app-bridge-react'
import { ImageMajor, AlertMinor } from '@shopify/polaris-icons'
import { NoteMinor } from '@shopify/polaris-icons'

/* Import the useAuthenticatedFetch hook included in the Node app template */
import { useAuthenticatedFetch, useShopifyQuery } from '../hooks'

/* Import custom hooks for forms */
import { useForm, useField, notEmptyString } from '@shopify/react-form'

export const AddVideoForm = ({ savedProduct }) => {
  const navigate = useNavigate()
  const appBridge = useAppBridge()
  const fetch = useAuthenticatedFetch()
  const [product, setProduct] = React.useState(savedProduct)
  const [selectedCta, setSelectedCta] = useState('shop_now')

  const handleSelectChange = useCallback((value) => setSelectedCta(value), [])

  const options = [
    { label: 'Shop Now', value: 'shop_now' },
    { label: 'See More', value: 'see_more' },
    { label: 'Contact Now', value: 'contact_now' },
  ]

  React.useEffect(() => {
    setProduct(savedProduct)
  }, [savedProduct])

  const onSubmit = useCallback(
    (body) => {
      ;(async () => {
        let id = product
          ? product?.id
          : new Date().getUTCMilliseconds().toString()
        const data = { ...body, id: id }
        const productList = await JSON.parse(
          localStorage.getItem(`${appBridge.hostOrigin}-product`)
        )
        const isProductAlreadyExist = productList?.filter(
          (product) => product?.id === id
        )
        makeClean()
        if (
          isProductAlreadyExist === undefined ||
          isProductAlreadyExist.length === 0
        ) {
          await SaveDataToLocalStorage(data)
          setProduct(data)
          // id = ''
          navigate(`/video/${data.id}`)
        } else {
          let editedData = isProductAlreadyExist?.[0]
          editedData = { ...editedData, ...data }
          await SaveEditedDataToLocalStorage(editedData)
          // id = ''
          setProduct(editedData)
        }
      })()
      return { status: 'success' }
    },
    [product, setProduct]
  )

  const SaveEditedDataToLocalStorage = async (data) => {
    let tempArray = []
    tempArray =
      (await JSON.parse(
        localStorage.getItem(`${appBridge.hostOrigin}-product`)
      )) || []
    tempArray.forEach((product) => {
      if (product.id === data.id) {
        tempArray.splice(tempArray.indexOf(product), 1, data)
      } else {
        return product
      }
    })
    localStorage.setItem(
      `${appBridge.hostOrigin}-product`,
      JSON.stringify(tempArray)
    )
  }
  const SaveDataToLocalStorage = async (data) => {
    let tempArray = []
    tempArray =
      (await JSON.parse(
        localStorage.getItem(`${appBridge.hostOrigin}-product`)
      )) || []
    tempArray.push(data)
    localStorage.setItem(
      `${appBridge.hostOrigin}-product`,
      JSON.stringify(tempArray)
    )
  }

  const {
    fields: { title, hastags, videourl, videolink },
    reset,
    submitting,
    submit,
    makeClean,
    dirty,
  } = useForm({
    fields: {
      title: useField({
        value: '' || product?.title,
        validates: [notEmptyString('Please enter a caption')],
      }),
      hastags: useField({
        value: '' || product?.hastags,
        validates: [notEmptyString('Please enter hashtags')],
      }),
      videourl: useField({
        value: '' || product?.videourl,
        validates: [notEmptyString('Please enter a video url')],
      }),
      videolink: useField({
        value: '' || product?.videolink,
        validates: [notEmptyString('Please enter a video link')],
      }),
    },
    onSubmit,
  })

  return (
    <Stack vertical>
      <Layout>
        <Layout.Section>
          <Form>
            <ContextualSaveBar
              saveAction={{
                label: 'Save',
                onAction: submit,
                loading: submitting,
                disabled: submitting,
              }}
              discardAction={{
                label: 'Discard',
                onAction: reset,
                loading: submitting,
                disabled: submitting,
              }}
              visible={dirty}
              fullWidth
            />
            <FormLayout>
              <Card sectioned title='Caption'>
                <TextField {...title} label='Caption' />
              </Card>
              <Card sectioned title='Hashtags'>
                <TextField {...hastags} label='Hashtags' />
              </Card>
              <Card sectioned title='Video Options'>
                <List sectioned>
                  <List.Item>
                    <TextField {...videourl} label='Video Url' />
                  </List.Item>
                  <List.Item>
                    <TextField {...videolink} label='CTA Link' />
                  </List.Item>
                </List>
              </Card>
            </FormLayout>
          </Form>
        </Layout.Section>
        <Layout.Section secondary>
          <Card sectioned title='Imported Video'>
            {savedProduct?.videolink ? (
              <div
                style={{
                  height: '400px',
                  width: '200px',
                  margin: '0 auto 20px auto',
                  position: 'relative',
                }}
              >
                <video
                  controls
                  loop
                  muted
                  playsInline
                  src={savedProduct?.videourl}
                  style={{ width: '100%', height: '100%', margin: '0 auto' }}
                >
                  <source
                    src={savedProduct?.videourl}
                    type='video/mp4'
                  ></source>
                  <source
                    src={savedProduct?.videourl}
                    type='video/webm'
                  ></source>
                  <source
                    src={savedProduct?.videourl}
                    type='video/mov'
                  ></source>
                </video>
                <div
                  style={{
                    position: 'absolute',
                    left: '50%',
                    bottom: '50px',
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <Select
                    options={options}
                    onChange={handleSelectChange}
                    value={selectedCta}
                  />
                </div>
              </div>
            ) : (
              // <EmptyState imageContained={true} />
              <EmptyState>
                <p>Video Preview will appear here after you save.</p>
              </EmptyState>
            )}
            <Stack vertical></Stack>
          </Card>
        </Layout.Section>
      </Layout>
    </Stack>
  )
}
/* Builds a URL to the selected product */
function productViewURL({ host, productHandle }) {
  const url = new URL(host)
  const productPath = `/products/${productHandle}`
  url.pathname = productPath
  return url.toString()
}

/* Builds a URL to a checkout that contains the selected product */
function productCheckoutURL({ host, variantId, quantity = 1 }) {
  const url = new URL(host)
  const id = variantId.replace(
    /gid:\/\/shopify\/ProductVariant\/([0-9]+)/,
    '$1'
  )
  url.pathname = `/cart/${id}:${quantity}`
  return url.toString()
}
