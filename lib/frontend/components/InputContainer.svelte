<script>
  import { parseStatusStore, requestStore, swStatusStore } from '../stores'
  import Input from './Input.svelte'
  import Status from './Status.svelte'

  $: error = ($requestStore && $requestStore.error) ? $requestStore.error : null
  $: pending = Boolean($requestStore && !$requestStore.error)
  $: pendingRequest = $requestStore
  $: status = $parseStatusStore
  $: swStatus = $swStatusStore
</script>

<div class="input-container">
  <Input
    {pending}
    {error}
  />
  <Status
    {error}
    {pending}
    {pendingRequest}
    {status}
    {swStatus}
  />
</div>
