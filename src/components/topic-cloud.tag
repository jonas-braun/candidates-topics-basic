<topic-cloud class="topic-cloud">

  <form ref="selection">
    <ul>
      <li each={slug, name in parties}>
        <label>
          <input type="checkbox" name="party" value={slug} checked={isSelected(slug)} onchange={toggle}>
          {name}
        </label>
      </li>
    </ul>
  </form>

  <ul class="topic-cloud__list">
    <li
      each={candidates}
      class="topic-cloud__item {getClassName(party)}"
      style="opacity: {value}"
    >
      {name}
    </li>
  </ul>

  <script type='es6'>
    import { scaleLinear, min, max } from 'd3'

    const PARTIES = {
      'CDU': 'cdu',
      'CSU': 'cdu',
      'SPD': 'spd',
      'DIE GRÜNEN': 'gruene',
      'DIE LINKE': 'linke',
      'FDP': 'fdp',
      'AfD': 'afd'
    }

    this.toggle = ({target}) => {
      if (target.checked) {
        this.selected.push(target.value)
      } else {
        const index = this.selected.indexOf(target.value)
        this.selected.splice(index, 1)
      }
    }

    this.isSelected = slug => this.selected.indexOf(slug) >= 0

    this.getClassName = (party) => {
      if (this.selected.indexOf(party) < 0) {
        return 'topic-cloud__item--disabled'
      } else {
        return `topic-cloud__item--${party}`
      }
    }

    this.on('before-mount', () => {
      const topic = this.opts.topic
      const limit = this.opts.limit
      const minValue = min(this.opts.data, d => d[topic])
      const maxValue = max(this.opts.data, d => d[topic])
      const scale = scaleLinear()
        .domain([minValue, maxValue])
        .range([0, 1])

      this.parties = PARTIES
      this.selected = this.opts.selected.split(', ')

      this.candidates = this.opts.data
        .filter(d => d[topic] > limit)
        .sort((a, b) => b[topic] - a[topic])
        .map(d => ({
          name: d.name,
          party: PARTIES[d.party],
          value: scale(d[topic])
        }))
    })

  </script>

</topic-cloud>
