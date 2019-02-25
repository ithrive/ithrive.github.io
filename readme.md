# iThrive website

iThrive website developed using [Jekyll](jekyllrb.com) and hosted on [GitHub pages](https://pages.github.com/).


## Editing notes

### Get the latest changes

- Run `git pull`

### Create new knowledge base item:

- Run `./_gen-knowledge-base.sh`
- The file will automatically be added to your Git project

### Submit changes

- Run `git commit -am "Describe the change"`

### Publish changes

- Run `git push`



## Development

Install rvm, npm (via nvm) and then:

```
npm install -g grunt-cli bower
rvm install 2.3
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

## Production

```
JEKYLL_ENV=production jekyll build
static -p 8080 _site/
```