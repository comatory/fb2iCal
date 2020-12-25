<script>
  import InputContainer from './InputContainer.svelte'
  import EventList from './EventList.svelte'
  import Status from './Status.svelte'
  import TrackingPanel from './TrackingPanel.svelte'

  import { configStore, eventStore } from '../stores'

  $: showTrackingPanel = $configStore.track === undefined
  $: showEventList = $eventStore.events.length > 0
</script>

{#if showTrackingPanel}
  <TrackingPanel />
{/if}

<InputContainer />
{#if showEventList}
  <EventList />
{/if}

