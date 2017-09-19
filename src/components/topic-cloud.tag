<topic-cloud class="topic-cloud">

  <ul class="topic-cloud__list">
    <li each={candidates} class="topic-cloud__item topic-cloud__item--{party}">
      {name}
    </li>
  </ul>

  <script type='es6'>
    this.on('before-mount', () => {
      const topic = 'arbeit'
      const limit = 0.076

      const PARTIES = {
        'CDU': 'cdu',
        'CSU': 'cdu',
        'SPD': 'spd',
        'DIE GRÜNEN': 'gruene',
        'AfD': 'afd',
        'FDP': 'fdp',
        'DIE LINKE': 'linke'
      }

      this.candidates = this.opts.data
        .filter(candidate => candidate[topic] > limit)
        .sort((a, b) => b[topic] - a[topic])
        .map(candidate => ({
          name: candidate.name,
          party: PARTIES[candidate.party],
          value: candidate[topic]
        }))
    })
  </script>

</topic-cloud>
