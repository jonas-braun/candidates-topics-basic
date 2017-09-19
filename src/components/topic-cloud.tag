<topic-cloud class="topic-cloud">

  <ul class="topic-cloud__list">
    <li
      each={candidates}
      class="topic-cloud__item topic-cloud__item--{party}"
      style="opacity: {value}"
    >
      {name}
    </li>
  </ul>

  <script type='es6'>
    import { scaleLinear, min, max } from 'd3'

    this.on('before-mount', () => {
      const PARTIES = {
        'CDU': 'cdu',
        'CSU': 'cdu',
        'SPD': 'spd',
        'DIE GRÜNEN': 'gruene',
        'AfD': 'afd',
        'FDP': 'fdp',
        'DIE LINKE': 'linke'
      }

      const topic = this.opts.topic
      const limit = this.opts.limit

      const minValue = min(this.opts.data, d => d[topic])
      const maxValue = max(this.opts.data, d => d[topic])

      const scale = scaleLinear()
        .domain([minValue, maxValue])
        .range([0, 1])

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
