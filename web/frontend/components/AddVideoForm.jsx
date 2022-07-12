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

export function AddVideoForm() {
  const [file, setFile] = useState()
  const [showResourcePicker, setShowResourcePicker] = useState(false)
  const navigate = useNavigate()
  const appBridge = useAppBridge()
  const fetch = useAuthenticatedFetch()

  const onSubmit = (body) => console.log('submit', body)

  const {
    fields: { title, hastags, videolink },
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
      videolink: useField({
        value: '',
        validates: [notEmptyString('Please enter a video link')],
      }),
    },
    onSubmit,
  })

  const handleDropZoneDrop = useCallback(
    (_dropFiles, acceptedFiles, _rejectedFiles) =>
      setFile((file) => acceptedFiles[0]),
    []
  )
  console.log('drop', file)

  const validImageTypes = ['image/gif', 'image/jpeg', 'image/png']

  const fileUpload = !file && <DropZone.FileUpload />
  const uploadedFile = file && (
    <Stack>
      <Thumbnail
        size='large'
        alt={file.name}
        source={
          validImageTypes.includes(file.type)
            ? window.URL.createObjectURL(file)
            : NoteMinor
        }
      />
      <div>
        {file.name}
        <Caption>{file.size} bytes</Caption>
      </div>
    </Stack>
  )

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
              <Card sectioned title='Video link'>
                <TextField {...videolink} label='Video link' />
              </Card>
            </FormLayout>
          </Form>
        </Layout.Section>
        <Layout.Section secondary>
          <Card sectioned title='Add video'>
            {file ? (
              <VideoThumbnail thumbnailUrl={file} />
            ) : (
              <DropZone allowMultiple={false} onDrop={handleDropZoneDrop}>
                {uploadedFile}
                {fileUpload}
              </DropZone>
            )}
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
