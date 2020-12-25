<script>
  import { parseStatusStore, requestStore, swStatusStore } from '../stores'
  import Input from './Input.svelte'
  import Status from './Status.svelte'

  $: error = ($requestStore && $requestStore.error) ? $requestStore.error : null
  $: pending = Boolean($requestStore && !$requestStore.error)
  $: pendingRequest = $requestStore
  $: status = $parseStatusStore
  $: swStatus = $swStatusStore

  const handleModuleLoadStart = () => parseStatusStore.set('Loading application data.')
  const handleModuleLoadEnd = () => parseStatusStore.set(null)
  const handleModuleLoadError = (error) => parseStatusStore.set('Failed to load application data.')
</script>

<div class="input-container">
  <Input
    {pending}
    {pendingRequest}
    {error}
    onModuleLoadStart={handleModuleLoadStart}
    onModuleLoadStop={handleModuleLoadEnd}
    onModuleLoadError={handleModuleLoadError}
  />
  <Status
    {error}
    {pending}
    {pendingRequest}
    {status}
    {swStatus}
  />
</div>
