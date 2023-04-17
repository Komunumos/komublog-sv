# Komublog-sv
Komublog is a microblogging platform, but also aims to be a full fledged blogging/social platform in the future.

Our goal is to always be 100% open source and get to a point where it can be easily configured for different uses. Like forums, personal blogs 

This project is built using a combination of SvelteKit for the frontend, and PocketBase(as a framework) for the backend. This is the frontend project.

You can check the running website here: [komublog](https://komu.blog)

## Features
The project is still a **work in progress** current features include:
* creating accounts
* configuring name and avatar
* posting messages
* posting images
* user pages
* limited markdown support
* tagging other users (albeit without a notification center this is quite pointless atm)

## Running and building
If you want to run your own version of komublog you will also need to run the backend project, you can follow the instructions here it [here](https://github.com/Komunumos/komuback).

Since it a sveltekit project you run and build like you would do any other svelte kit project

Install dependencies
```
pnpm install
```

Run locally
```
pnpm run dev
```

Build
```
pnpm run build
```

API Url needs to be configured to point to your pocketbase instance in the config.ts file
```
export default {
    apiUrl: "http://127.0.0.1:8090"
}
```

## Contributing
I don't have a defined way of contributing right now, if you are interesting contact me on twitter/email. 👀

## Credits
This project was built using the following open source libraries and services:

- [Svelte](https://svelte.dev/) - A reactive web framework
- [SvelteKit](https://kit.svelte.dev/) - A framework for building web applications with Svelte
- [PocketBase](https://www.pocketbase.io/) - A backend as a service written in Go with a SQLite db.
- [SQLite](https://sqlite.org/) - A serverless, self-contained SQL database engine
- [image-resize](https://github.com/scalableminds/image-resize) - A Node.js image resizing library
- [marked](https://marked.js.org/) - A Markdown parser and compiler
- [TributeJS](https://github.com/zurb/tribute) - A library for implementing @mentions
- [EasyMDE](https://github.com/Ionaru/easy-markdown-editor) - A simple, powerful, and easy-to-use Markdown editor for web browsers

Thanks to the authors of these libraries, couldn't have created this project without them. 🙏🏻

## Contact
You can find me on 
- twitter [@renatofontes](https://twitter.com/renatofontes)
- email renato[at]komu.blog
- komublog [@renato](https://komu.blog/@renato)