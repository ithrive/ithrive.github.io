# iThrive website

iThrive website developed using [Jekyll](jekyllrb.com) and hosted on [GitHub pages](https://pages.github.com/).


## Creating

### New knowledge base item

Run: `./_gen-knowledge-base.sh`


## Development

Install RVM (see website).

```
npm install -g grunt-cli bower
rvm install ruby 2.2.2
gem install bundler
```

Install:
```
npm install
bower install
bundle install
```

Run:
```
# Single command
grunt serve

# Or...
bundle exec jekyll serve --watch
grunt watch
```

Build production via: `JEKYLL_ENV=production jekyll build`

