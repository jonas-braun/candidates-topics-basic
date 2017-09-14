<customize-this-tag-name>

  <input
    type="range"
    min="0"
    max="100"
    value={ opts.value }
    oninput={ onInput }
  />

  <output>{ value }</output>

  <script type="es6">
    this.update({value: this.opts.intialValue})

    this.onInput = (event) => {
      event.stopPropagation()
      this.value = event.target.value
    }
  </script>

</customize-this-tag-name>
