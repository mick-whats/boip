# boip

a command line application that creates a new project from a boilerplate stored on GitHub

https://boip-doc.netlify.com/ (日本語ドキュメント)

## Install

```
$ npm install -g boip
```

# useit
```
> cd /path/to
> boip create
? please input new project name › myProject
? please input github repository “owner/repo" › mick-whats/bo#sample
? What is the value of "owner"? › mick-whats

?
📁 New project directory: /path/to/myProject
📙 boilerplate: mick-whats/bo#sample
🖌️ injections: {
  "name": "myProject",
  "owner": "mick-whats"
}
📌 Number of new files: 9
? Do you want to execute? › no / yes

✔ create /path/to/myProject/.eslintrc.json
✔ create /path/to/myProject/.gitignore
✔ create /path/to/myProject/LICENSE.txt
✔ create /path/to/myProject/README.md
✔ create /path/to/myProject/package.json
✔ create /path/to/myProject/nojectSample.md
✔ create /path/to/myProject/sample.md
✔ create /path/to/myProject/lib/index.js
✔ create /path/to/myProject/test/index.test.js
created new Project: myProject
```

example

```
> boip create
# If you do not give the option will be interactive input

> boip new
# "new" is an alias of "create"

> boip create myProject
# The first argument is the project name

> boip create myProject -r "mick-whats/bo#sample"
# This is an example where repository is specified

> boip create -od
# option "offline" and "dry"
```
## Related

- [download-git-repo](https://gitlab.com/flippidippi/download-git-repo) - Download and extract a git repository (GitHub, GitLab, Bitbucket) from node.
- [temject.copy](https://github.com/mick-whats/temject.copy) - Copy the file while converting with temject

## License

MIT © [Mick Whats](https://github.com/mick-whats)

