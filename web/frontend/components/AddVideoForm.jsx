import { useState, useCallback } from 'react'
import {
  Banner,
  Card,
  Form,
  FormLayout,
  TextField,
  Button,
  ChoiceList,
  Select,
  Thumbnail,
  Icon,
  Stack,
  TextStyle,
  Layout,
  EmptyState,
  DropZone,
  Caption,
  VideoThumbnail,
} from '@shopify/polaris'
import {
  ContextualSaveBar,
  ResourcePicker,
  useAppBridge,
  useNavigate,
} from '@shopify/app-bridge-react'
import { ImageMajor, AlertMinor } from '@shopify/polaris-icons'
import { NoteMinor } from '@shopify/polaris-icons'

/* Import the useAuthenticatedFetch hook included in the Node app template */
import { useAuthenticatedFetch, useShopifyQuery } from '../hooks'

/* Import custom hooks for forms */
import { useForm, useField, notEmptyString } from '@shopify/react-form'

export const AddVideoForm = () => {
  const [file, setFile] = useState()
  const navigate = useNavigate()
  const appBridge = useAppBridge()
  const fetch = useAuthenticatedFetch()

  const onSubmit = (body) => {
    console.log('submited data', body)
    localStorage.setItem(
      `${appBridge.hostOrigin}-product`,
      JSON.stringify(body)
    )
  }

  const {
    fields: { title, hastags, videourl, videolink },
    dirty,
    reset,
    submitting,
    submit,
    makeClean,
  } = useForm({
    fields: {
      title: useField({
        value: '',
        validates: [notEmptyString('Please enter a caption')],
      }),
      hastags: useField({
        value: '',
        validates: [notEmptyString('Please enter hashtags')],
      }),
      videourl: useField({
        value: '',
        validates: [notEmptyString('Please enter a video url')],
      }),
      videolink: useField({
        value: '',
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
                <TextField {...videourl} label='Video Url' />
                <TextField {...videolink} label='Video Link' />
              </Card>
            </FormLayout>
          </Form>
        </Layout.Section>
        <Layout.Section secondary>
          <Card sectioned title='Imported Video'>
            {false ? (
              <EmptyState imageContained={true} />
            ) : (
              <EmptyState>
                <p>Video Preview will appear here after you save.</p>
              </EmptyState>
            )}
            <Stack vertical>
              <Button
                fullWidth
                primary
                download
                // url={QRCodeURL}
                // disabled={!QRCode || isDeleting}
              >
                Download
              </Button>
              <Button
                fullWidth
                // onClick={goToDestination}
                // disabled={!selectedProduct}
              >
                Go to destination
              </Button>
            </Stack>
          </Card>
        </Layout.Section>
        <Layout.Section>
          {/* {QRCode?.id && (
            <Button
              outline
              destructive
              onClick={deleteQRCode}
              loading={isDeleting}
            >
              Delete QR code
            </Button>
          )} */}
        </Layout.Section>
      </Layout>
    </Stack>
  )
}
/* Builds a URL to the selected product */
function productViewURL({ host, productHandle, discountCode }) {
  const url = new URL(host)
  const productPath = `/products/${productHandle}`
  url.pathname = productPath
  return url.toString()
}

/* Builds a URL to a checkout that contains the selected product */
function productCheckoutURL({ host, variantId, quantity = 1, discountCode }) {
  const url = new URL(host)
  const id = variantId.replace(
    /gid:\/\/shopify\/ProductVariant\/([0-9]+)/,
    '$1'
  )
  url.pathname = `/cart/${id}:${quantity}`
  return url.toString()
}
