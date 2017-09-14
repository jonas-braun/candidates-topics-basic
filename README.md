# Visualization for #btw17 project

## use topic model to show which candidates have which topics in their promotional texts

the data is generated in analysis-btw17-candidates-topics

data source is abgeordnetenwatch.de (and google "Kandidaten in der Google Suche" for the top candidates)

the candidate cloud is based on 8 abstract topics, that were found using NMF (nonzero matrix factorization). The top words for each candidate are their tf-idf (term frequency - inverse document frequency) scores.

The topic filters (for the five topics "arbeit", "natur", ...) are based on manually selected wordlists. the sources for the wordlists are in analysis-btw17-candidates-topics.

Installation:

```
npm install
```

Start Development Server:

```
npm run dev
```

Build Production Version:

```
npm run build
```

