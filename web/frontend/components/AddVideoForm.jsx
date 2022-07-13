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
  ButtonGroup,
  List,
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

export const AddVideoForm = ({ savedProduct }) => {
  const [file, setFile] = useState()
  const [productList, setProductList] = useState([])
  const navigate = useNavigate()
  const appBridge = useAppBridge()
  const fetch = useAuthenticatedFetch()

  const onSubmit = async (body) => {
    const id = new Date().getUTCMilliseconds().toString()
    const data = { ...body, id: id }
    console.log('submited data', data)

    const productList = await JSON.parse(
      localStorage.getItem(`${appBridge.hostOrigin}-product`)
    )

    const currentId = productList.filter((product) => product.id === id)
    console.log(currentId, 'currentId')

    makeClean()
    await SaveDataToLocalStorage(data)
    if (currentId.length === 0) {
      navigate(`/video/${data.id}`)
    } else {
      //important
    }
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
                    <TextField {...videolink} label='Video Link' />
                  </List.Item>
                </List>
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
          <ButtonGroup>
            <Button loading={submitting} disabled={submitting} onClick={reset}>
              Discard
            </Button>
            <Button
              primary
              loading={submitting}
              disabled={submitting}
              onClick={submit}
            >
              Save
            </Button>
          </ButtonGroup>
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
