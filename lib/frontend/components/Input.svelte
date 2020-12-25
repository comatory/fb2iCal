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
  import { createEvent } from '../actions'
  import logger from '../services/logger'

  export let error
  export let pending

  let value
  let form

  let inputClasses = ''
  $: inputClasses = [
    error ? 'input--error' : '',
    pending ? 'input--pending': '',
  ].join(' ')

  const handleSubmit = (e) => {
    if (!form.reportValidity()) {
      return
    }

    e.preventDefault()

    createEvent(value, { logger })
  }
</script>

<form id="form" on:submit={handleSubmit} bind:this={form}>
  <input
    required
    pattern={String.raw`^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?|\d+$`}
    id="url"
    name="url"
    class={inputClasses}
    bind:value={value}
    disabled={pending}
    placeholder="Paste / type FB event URL or event number..."
    title="Please insert Facebook Event URL / Number"
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
