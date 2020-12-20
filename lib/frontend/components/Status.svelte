<style>
  #status {
    flex: 1;
    height: 1rem;
    margin: 5px;
  }

  .status-item {
    min-width: 200px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
</style>

<script>
  import { requestStore } from '../stores'

  $: error = ($requestStore && $requestStore.error) ? $requestStore.error : null
  $: pendingRequest = Boolean($requestStore && !$requestStore.error)
</script>

<div id='status'>
  {#if error}
    <div class='status-item'>
      {error.toString()}
    </div>
  {/if}
  {#if pendingRequest}
    <div class='status-item'>
      Fetching event {$requestStore.url}
    </div>
  {/if}
</div>
