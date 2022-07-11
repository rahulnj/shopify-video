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

const NO_DISCOUNT_OPTION = { label: 'No discount', value: '' }

/*
  The discount codes available in the store.

  This variable will only have a value after retrieving discount codes from the API.
*/
const DISCOUNT_CODES = {}

export function AddVideoForm({ QRCode: InitialQRCode }) {
  const [QRCode, setQRCode] = useState(InitialQRCode)
  const [file, setFile] = useState()
  const [showResourcePicker, setShowResourcePicker] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(QRCode?.product)
  const navigate = useNavigate()
  const appBridge = useAppBridge()
  const fetch = useAuthenticatedFetch()
  const deletedProduct = QRCode?.product?.title === 'Deleted product'

  /*
    This is a placeholder function that is triggered when the user hits the "Save" button.

    It will be replaced by a different function when the frontend is connected to the backend.
  */
  const onSubmit = (body) => console.log('submit', body)

  /*
    Sets up the form state with the useForm hook.

    Accepts a "fields" object that sets up each individual field with a default value and validation rules.

    Returns a "fields" object that is destructured to access each of the fields individually, so they can be used in other parts of the component.

    Returns helpers to manage form state, as well as component state that is based on form state.
  */
  const {
    fields: {
      title,
      productId,
      variantId,
      handle,
      discountId,
      discountCode,
      destination,
    },
    dirty,
    reset,
    submitting,
    submit,
    makeClean,
  } = useForm({
    fields: {
      title: useField({
        value: QRCode?.title || '',
        validates: [notEmptyString('Please enter a caption')],
      }),
      title: useField({
        value: QRCode?.title || '',
        validates: [notEmptyString('Please enter hashtags')],
      }),
      title: useField({
        value: QRCode?.title || '',
        validates: [notEmptyString('Please enter a video link')],
      }),
    },
    onSubmit,
  })

  const QRCodeURL = QRCode
    ? new URL(`/qrcodes/${QRCode.id}/image`, location.toString()).toString()
    : null

  /*
    This is a placeholder function that is triggered when the user hits the "Delete" button.

    It will be replaced by a different function when the frontend is connected to the backend.
  */
  const isDeleting = false
  const deleteQRCode = () => console.log('delete')

  /*
    This function runs when a user clicks the "Go to destination" button.

    It uses data from the App Bridge context as well as form state to construct destination URLs using the URL helpers you created.
  */
  const goToDestination = useCallback(() => {
    if (!selectedProduct) return
    const data = {
      host: appBridge.hostOrigin,
      productHandle: handle.value || selectedProduct.handle,
      discountCode: discountCode.value || undefined,
      variantId: variantId.value,
    }

    const targetURL =
      deletedProduct || destination.value[0] === 'product'
        ? productViewURL(data)
        : productCheckoutURL(data)

    window.open(targetURL, '_blank', 'noreferrer,noopener')
  }, [QRCode, selectedProduct, destination, discountCode, handle, variantId])

  /*
    This array is used in a select field in the form to manage discount options.

    It will be extended when the frontend is connected to the backend and the array is populated with discount data from the store.

    For now, it contains only the default value.
  */
  const isLoadingDiscounts = true
  const discountOptions = [NO_DISCOUNT_OPTION]

  const handleDropZoneDrop = useCallback(
    (_dropFiles, acceptedFiles, _rejectedFiles) =>
      setFile((file) => acceptedFiles[0]),
    []
  )

  const validImageTypes = ['image/gif', 'image/jpeg', 'image/png']

  const fileUpload = !file && <DropZone.FileUpload />
  const uploadedFile = file && (
    <Stack>
      <Thumbnail
        size='small'
        alt={file.name}
        source={
          validImageTypes.includes(file.type)
            ? window.URL.createObjectURL(file)
            : NoteMinor
        }
      />
      <div>
        {file.name} <Caption>{file.size} bytes</Caption>
      </div>
    </Stack>
  )

  /* The form layout, created using Polaris and App Bridge components. */
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
                <TextField {...title} label='Hashtags' />
              </Card>
              <Card sectioned title='Video link'>
                <TextField {...title} label='Video link' />
              </Card>
            </FormLayout>
          </Form>
        </Layout.Section>
        <Layout.Section secondary>
          <Card sectioned title='Add video'>
            <DropZone allowMultiple={false} onDrop={handleDropZoneDrop}>
              {uploadedFile}
              {fileUpload}
            </DropZone>
          </Card>
        </Layout.Section>
        <Layout.Section>
          {QRCode?.id && (
            <Button
              outline
              destructive
              onClick={deleteQRCode}
              loading={isDeleting}
            >
              Delete QR code
            </Button>
          )}
        </Layout.Section>
      </Layout>
    </Stack>
  )
}

/* Builds a URL to the selected product */
function productViewURL({ host, productHandle, discountCode }) {
  const url = new URL(host)
  const productPath = `/products/${productHandle}`

  /*
    If a discount is selected, then build a URL to the selected discount that redirects to the selected product: /discount/{code}?redirect=/products/{product}
  */
  if (discountCode) {
    url.pathname = `/discount/${discountCode}`
    url.searchParams.append('redirect', productPath)
  } else {
    url.pathname = productPath
  }

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

  /* Builds a URL to a checkout that contains the selected product with a discount code applied */
  if (discountCode) {
    url.searchParams.append('discount', discountCode)
  }

  return url.toString()
}
