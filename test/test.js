const Metalsmith = require('metalsmith');
Metalsmith(__dirname)         // __dirname defined by node.js:
  // name of current working directory
  .metadata({                 // add any variable you want
    // use them in layout-files
    sitename: "My Static Site & Blog",
    siteurl: "http://example.com/",
    description: "It's about saying »Hello« to the world.",
    generatorname: "Metalsmith",
    generatorurl: "http://metalsmith.io/"
  })
  .source('../lib')            // source directory
  .destination('./build')     // destination directory
  .clean(true)                // clean destination before
  // .use(collections({          // group all blog posts by internally
  //   posts: 'posts/*.md'       // adding key 'collections':'posts'
  // }))                         // use `collections.posts` in layouts
  // .use(markdown())            // transpile all md into html
  // .use(permalinks({           // change URLs to permalink URLs
  //   relative: false           // put css only in /css
  // }))
  // .use(layouts())             // wrap layouts around html
  .build(function (err) {      // build process
    if (err) throw err;       // error handling is required
  });
