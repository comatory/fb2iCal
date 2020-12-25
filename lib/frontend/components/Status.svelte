<style>
  #status {
    flex: 1;
    min-height: 1rem;
    max-height: 3rem;
    overflow: auto;
    margin: 5px;
  }

  .status-item {
    min-width: 200px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  .status-item--error {
    box-sizing: border-box;
    border: 1px solid firebrick;
    background-color: salmon;
    color: darkred;
  }
</style>

<script>
  export let error
  export let pending
  export let pendingRequest
  export let status
  export let swStatus
</script>

<div id='status'>
  {#if error}
    <div class='status-item status-item--error'>
      {error.toString()}
    </div>
  {/if}
  {#if pending && pendingRequest}
    <div class='status-item'>
      Fetching event {pendingRequest.url}
    </div>
  {/if}
  {#if status}
    <div class='status-item'>
      {status}
    </div>
  {/if}
  {#if swStatus}
    <div class='status-item'>
      {swStatus}
    </div>
  {/if}
</div>
