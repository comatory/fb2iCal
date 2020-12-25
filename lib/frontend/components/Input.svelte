<style>
  #form {
    box-sizing: border-box;
    flex: 1;
    display: flex;
    min-width: 300px;
  }

  #form input {
    margin: 5px;
  }

  input#url {
    flex: 1;
    font-size: 1rem;
  }

  .input--error {
    border: 1px solid firebrick;
  }
</style>

<script>
  import logger from '../services/logger'

  export let error
  export let pending
  export let pendingRequest

  let value = ''
  $: value = error && pendingRequest && pendingRequest.url || ''
  let form

  let inputClasses = ''
  $: inputClasses = [
    error ? 'input--error' : '',
    pending ? 'input--pending': '',
  ].join(' ')

  const handleSubmit = async (e) => {
    if (!form.reportValidity()) {
      return
    }

    e.preventDefault()

   try {
     const module = await import('../actions')
     module.createEvent(value, { logger })
     value = ''
   } catch (importError) {
     console.error(importError)
   }
  }

  const handleChange = (e) => {
    value = e.currentTarget.value
  }
</script>

<form id="form" on:submit={handleSubmit} bind:this={form}>
  <input
    required
    pattern={String.raw`^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?|\d+$`}
    id="url"
    name="url"
    class={inputClasses}
    disabled={pending}
    placeholder="Paste / type FB event URL or event number..."
    title="Please insert Facebook Event URL / Number"
    on:change={handleChange}
    value={value}
  />
  <input
    id="submit"
    class={inputClasses}
    type='submit'
    value='Submit'
    disabled={pending}
    on:click={handleSubmit}
  />
</form>
