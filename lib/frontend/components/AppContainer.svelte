<script>
  import Input from './Input.svelte'
  import TrackingPanel from './TrackingPanel.svelte'
  import EventList from './EventList.svelte'

  import { configStore, eventStore } from '../stores'

  $: showTrackingPanel = $configStore.track === undefined
  $: showEventList = $eventStore.events.length > 0
</script>

{#if showTrackingPanel}
  <TrackingPanel />
{/if}

<Input />
{#if showEventList}
  <EventList />
{/if}

