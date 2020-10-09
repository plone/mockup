# Introduction

CAUTION: this is a work in progress.
Things might change without advanced notice and errors in the docs are possible.
You have been warned. ;-)

Assuming you successfully set up your development environment,
as described under the [Getting Started](#getting-started) section,
you are now ready to write your first pattern!

Unless stated otherwise,
the _mockup_ directory
(the one that you cloned the repository into)
will be our root working directory throughout this tutorial.
All the paths and filenames are specified **relative** to it.

You might also want to review the _Mockup Project Structure_ section of _Getting Started_ for an overview of what lives where in the project.

<pre>
mockup/
  CHANGES.rst
  CONTRIBUTING.rst
  LICENSE.rst
  Makefile
  MANIFEST.in
  mockup/
    build/
    configure.zcml
    CONTRIBUTE.md
    GETTING_STARTED.md
    Gruntfile.js
    index.html
    __init__.py
    js/
      bundles/
      	widgets.js
      	&hellip;
      config.js
      &hellip;
      router.js
      ui/
      utils.js
    LEARN.md
    less/
    lib/
    node_modules/
    patterns/
    tests/
  package.json
  &hellip;
</pre>

## Creating a New Pattern

Our HelloWorld pattern will be very simple -
all it will do is to change the text of some HTML label to "Hello, World!".
So, let's get started!

### Defining the Pattern

The first step is to go to the _/patterns_ subdirectory, create a directory called _/hello_, and then create a file _pattern.js_ in the _/hello_ subdirectory in it with the following contents:

**patterns/hello/pattern.js:**

<pre>
define([
  'jquery',
  'pat-base'
], function ($, Base) {
  'use strict';

  var HelloWorld = Base.extend({
    name: 'helloworld',
    trigger: '.pat-helloworld',
    init: function () {
      var $label = this.$el;
      $label.text('Hello, world!');
    }
  });

  return HelloWorld;
});
</pre>

<!-- XXX: syntax highlighting? -->

The file contains a call to the RequireJS's [define()](http://requirejs.org/docs/api.html#define) function,
which (unsurprisingly) defines a new JavaScript code module.
We pass two parameters to it:

1. An array containing the names of the module's dependencies.
   We state that we depend on jQuery and the base Mockup pattern module.
1. A function which returns an object that defines our _Hello World_ module.

When called,
this function is passed all the objects representing the module's dependencies
(in the same order as defined in the dependency list).
This allows us to use these dependencies in our module's code.

The way to actually create a new module is to call the **Base.extend()** method and pass the module definition to it.
The latter is just an object with some properties and,
as you can see,
the object describing our HelloWorld pattern is in fact very simple.
It only contains a _name_ property defining its name and an **init()** method.
The latter does the actual work of changing the label's text to _"Hello, world!"_.

You might be wondering what the <code>this.\$el</code> construct stands for.
It is just a reference to the jQuery wrapped DOM element on which the pattern has been invoked.

### Pattern Registration

In order to use the pattern we need to tell the bundling machinery where to find it and to start including it in the JavaScript bundles we create.
So, first open the file _js/config.js_ and add the following line under the _paths_ definitions
(omit the trailing comma if adding to the end of the paths list):

**js/config.js: map the pattern name to the path**

<pre>
  &hellip;
  var requirejsOptions = {
    baseUrl: './',
    paths: {
      &hellip;
      'underscore': 'node_modules/underscore/underscore',
      'mockup-patterns-helloworld': 'patterns/hello/pattern' // <- right here!
  },
  &hellip;
</pre>

This tells the bundling/packaging machinery that a module called _mockup-patterns-helloworld_ is defined in the file _pattern.js_ under the _patterns/hello_ subdirectory (relative to where config.js is located).  
**Note: we omit the file's .js suffix in the path definition**.

To tell the machinery to include our pattern in the widget bundle,
open the _js/bundles/widgets.js_ file and add mockup-patterns-helloworld* to the list of *dependencies passed to the define()\* function.

<!-- XXX: this is probably widgets-specific and will change after -->
<!-- refactoring.  Update this section at that point. -->

**js/bundles/widgets.js: include the pattern in the bundle**

<pre>
define([
  'jquery',
  &hellip;
  'mockup-patterns-helloworld' // <- the same name as in js/config.js
], function(&hellip;
</pre>

#### Bundle it up!

We now have everything ready to create a JavaScript bundle containing our
HelloWorld pattern.
From the &lt;mockup&gt; directory run the following console command:

<pre>
$ make bundle-widgets
</pre>

This determines all the dependencies and bundles them up into a single file
called _build/widgets.min.js_. It also copies some additional resources
(e.g. images and CSS files) to the same _build_ directory. See Gruntfile.js for
further details.

### Using the Pattern on a Page

Now that we have defined,
registered and bundled our HelloWorld pattern,
it's time to take it for a test drive!
Inside the subdirectory _/mockup_ (i.e _/mockup/mockup_) directory create a simple HTML file called _hello.html_ with the following contents:

**hello.html:**

<pre>
&lt;!DOCTYPE html&gt;
&lt;html&gt;
  &lt;head&gt;
    &lt;title&gt;Hello World Pattern&lt;/title&gt;
    &lt;script src="build/widgets.min.js"&gt;&lt;/script&gt;
  &lt;/head&gt;

  &lt;body&gt;
    &lt;label class="pat-helloworld"&gt;(no greeting yet)&lt;/label&gt;
  &lt;/body&gt;
&lt;/html&gt;</pre>

<!-- XXX: markup highlighting? -->

In the head we only need to include the bundled _widgets.min.js_ generated in the previous step.
The body of the document contains a label with some placeholder text.  
The important thing here is its **pat-helloworld** CSS class.
It tells the _HelloWorld_ pattern that it should perform its work on this particular DOM element.
This, by the way, is the general way of triggering the patterns -
you add a CSS class pat-&lt;pattern-name&gt; to the desired elements and the pattern &lt;pattern-name&gt; will be executed on them.

In case we want to apply more than one pattern to a single DOM element,
we can simply assign multiple \*pat-\*\* CSS classes to it.

To test the HelloWorld pattern open the _hello.html_ file with your browser directly from the filesystem and you should see "Hello, world!" displayed.
This text is different from the original label text -
our HelloWorld pattern automatically changed it.

## Adding Configuration Options to a Pattern

Patterns can provide various configuration options for customizing their
appearance and/or behavior. Let's modify our HelloWorld pattern so that it will
allow us to change the label's font color and its background color.

We first need to update the pattern definition in

**patterns/hello/pattern.js:**

<pre>
var HelloWorld = Base.extend({
  name: 'helloworld',
  defaults: {
    'color': 'black',
    'bgcolor': 'yellow'
  },
  init: function () {
    var $label = this.$el;
    $label.text('Hello, world!');
    $label.css({
      'color': this.options.color,
      'background': this.options.bgcolor
    });
  }
});
</pre>

We added a new attribute called **defaults** to the object describing the Hello World pattern.
The value of this attribute is another object containing the _&lt;option-name&gt;: &lt;default-value&gt;_ pairs,
which should be pretty self-explanatory.

In the _init()_ method we added some code which sets the label's font and background colors as defined by the pattern configuration options.
Option values can be read through the _this.options_ object (with \*this</em> pointing to the object describing the pattern).

**NOTE: Since we have changed the pattern's code we need to run the <code>make bundle-widgets</code> command from the console again,
so that the JavaScript bundle will contain the enhanced version of the HelloWorld pattern we just created.**

### The _data-pat-&lt;pattern-name&gt;_ Attribute

To see the changes in action, we slightly modify the _hello.html_ file.
The &lt;body&gt; should now contain the following:

<pre>
&lt;label class="pat-helloworld"
    data-pat-helloworld="color:white; bgcolor:black"&gt;(no greeting yet)&lt;/label&gt;
&lt;br&gt;
&lt;label class="pat-helloworld"
    data-pat-helloworld="color:green"&gt;(no greeting yet)&lt;/label&gt;
</pre>

And the result of the change:

<span style="color:white; background:black; cursor:default">Hello, world!</span><br>
<span style="color:green; background:yellow; cursor:default">Hello, world!</span><br><br>

We added another label and defined the **data-pat-helloworld** attribute on both.
The _data-pat-&lt;pattern-name&gt;_ attribute is used to pass configuration options to the pattern
(_color_ and _bgcolor_ in our case).
If some of the options are not provided, their corresponding default values are used
(as defined by the pattern).
This is why the second label gets a yellow background even though we haven't explicitly specified it.

If you wonder whether it is possible for a DOM element to have more than one \*data-pat-\*\* attribute defined,
the answer is of course YES,
because multiple patterns can be applied to a single DOM element at the same time.

### Options Format

There are two different ways to specify the option values in \*data-pat-\*\* attributes,
the key:value format and the JSON dictionary format.

#### Key : Value

This is the format we used in the example above. Each key represents the option with the same name,
while the corresponding value is, well, the option's value.
The key and the value are separated with a colon (:) and a semicolon (;) is used to separate multiple _key:value_ pairs.

#### JSON Dictionary

This format, too, uses _key:value_ pairs, but they are passed in a JSON dictionary,
like this:
<code>data-pat-helloworld="{&quot;color&quot;:
&quot;white&quot;, &quot;bgcolor&quot;: &quot;black&quot;}"</code>

Generally it doesn't really matter which of the two formats you use.
In most cases it is simply a matter of personal preference.
There is, however, one notable advantage of the JSON format -
the option values are not limited to just strings and numbers,
they can also be arbitrary JSON-compatible structures
(even nested).  
Sometimes when a pattern expects a complex configuration,
JSON format is your only choice.

### Nesting the Options

Setting the same options for many different elements over and over again can be a tedious task.
It also makes it more difficult to globally change such options later.  
Luckily the patterns provide a mechanism to avoid problems like these and that is _option nesting_.
It works as follows -
you can define a _data-pat-\*_ attribute on an element somewhere in the DOM hierarchy and all its descendants
(at all levels)
will _inherit the option values_ listed there!
This is quite a useful feature indeed.

Suppose we modify the _&lt;body&gt;_ tag in our *hello.html</em> page and add *data-pat-helloworld\* attribute to it:

<pre>
&lt;body data-pat-helloworld="bgcolor:orange"&gt;
</pre>

Suddenly,
all the elements using the HelloWorld pattern will get an orange background by default,
even though the true default background color as defined by the pattern is yellow.
Elements can override this behavior by explicitly providing their own value for the _bgcolor_ option.

If you now reload the _hello.html_ file in your browser,
you should see the following:

<span style="color:white; background:black; cursor:default">Hello,
world!</span><br>
<span style="color:green; background:orange; cursor:default">Hello,
world!</span><br><br>

The bottom of the two labels now indeed has an orange background,
because that's the option value that an element further up the hierarchy provides.
On the other hand the background color of the upper label remains black,
because that label provides its own value for the _bgcolor_ option,
overriding the value set by the _&lt;body&gt;_ tag.
We can see that the option values defined at lower levels have precedence over those defined higher up the DOM tree.

## Writing Tests

It's true that our HelloWorld pattern is very simple and doesn't contain any obscure bugs,
but with more complex patterns you can never be sure.
And even if they work flawlessly at the moment,
there's always a chance of introducing bugs when adding new features or refactoring the existing ones.
This is where the tests come in.
They can automatically run the patterns in different use case scenarios and make sure they behave as expected.

### Defining a Test Module

All tests are placed in the _tests_ subdirectory and the names of the files containing them must match the \*_-test.js_ pattern.
It is a good practice to name the files after the pattern they test.
Since we want to test the Hello World pattern,
we create a file called _tests/pattern-helloworld-test.js_ and put the following code into it:

**tests/pattern-helloworld-test.js:**

<pre>
define([
  'expect',
  'jquery',
  'pat-registry',
  'mockup-patterns-helloworld'
], function (expect, $, registry, HelloWorld) {
  "use strict";

  var mocha = window.mocha;

  window.mocha.setup('bdd');

  $.fx.off = true;  //disable jQuery animations for various reasons

  describe('HelloWorld', function () {
    beforeEach(function () {
      this.$el = $(
        '&lt;label class="pat-helloworld"&gt;(no greeting yet)&lt;/label&gt;'
      );
    });

    it('should change label text to "Hello, world!"', function () {
      expect(this.$el.text()).to.not.be.equal('Hello, world!');
      registry.scan(this.$el);
      expect(this.$el.text()).to.be.equal('Hello, world!');
    });
  });

});
</pre>

<!-- XXX: we really need syntax highlighting and line numbers -->

Test modules are defined in a similar way to patterns.
We call the _define()_ function,
list the module dependencies and provide a function which contains the actual test code.
Let's first explain some of the dependencies:

-   **[expect](https://github.com/LearnBoost/expect.js)** -
    A minimalistic BDD assertion toolkit based on the should.js test framework.
    <code>expect(result).to.be.above(0).and.not.equal(7)</code>.
-   **pat-registry** -
    the _registry_ is a collection of tools used for managing the patterns.
    It also keeps track of which patterns have been registered, hence its name.  
    In our example we use its **scan()** method,
    which scans the given DOM (sub)tree and applies patterns to all DOM elements in the tree where applicable.
-   **mockup-patterns-helloworld** -
    the pattern under test must always be listed among the test dependencies,
    even if we don't use it directly in the test code
    (as is the case here with our example).
    The reason is that the _registry.scan(\$element)_ method will apply our pattern to the _\$element_ only if the pattern is present in the test module's dependency list.

In the body of the test module disable jQuery animations
(<code>\$.fx.off = true</code>)
for a couple of good reasons:

-   Asynchronous animations on DOM elements might finish only after the test case has already come to an end.
    If the latter expects that a pattern changes some property of an element,
    but the change is delayed due to animation,
    an assertion in the test might erroneously fail.
-   Speed -
    in most cases animations are just eye candy for the users, and as such,
    are not needed during the test runs.
    Disabling them can sometimes considerably cut down the time needed to complete the tests.

#### The _describe()_ Function

We define a group of test cases by using the [describe()](https://mochajs.org/#interfaces) function found in the aforementioned Mocha test framework.
The first parameter is the name for the test case group,
which could be anything,
really (and not necessarily _"HelloWorld"_).
The second parameter is a function containing the actual test case definitions and/or the definitions of the test case subgroups
(yes, we can nest the _describe()_ function).

In our example we only have a single test case and it is defined by a call to the **it()** function.
We first provide a descriptive name for the test case,
which makes it very easy to see, what this test case expects from the pattern under test
(_'It should change label text to "Hello, world!"'_).
The second parameter is a function containing the actual test case code.
It first verifies that the label does not yet have the expected text.
Then it invokes the _registry.scan()_ method
(to apply the pattern)
and after that it checks again to see whether the pattern has indeed changed the text to _"Hello, world!"_.

The last thing to mention is the **beforeEach()** function.
The test framework calls this function before each test case is run,
giving us the opportunity to perform some initialization and setup work in it.
This way we don't have to repeat the same common initialization tasks separately in each test case,
resulting in a more readable and maintainable code.
In our concrete example,
all that we do in _beforeEach()_ is create a jQuery object representing a HTML label,
which later serves as a convenient test basis for the HelloWorld pattern.

Note that regarding the tests,
we have only scratched the surface here.
Describing all the options the test framework provides is beyond the scope of this tutorial.  
To learn more about how to write tests,
please consult Mocha's [documentation](https://mochajs.org/).

### Running the Tests

To run our test run the following console command from the _&lt;mockup&gt;_ directory:

<pre>
$ make test pattern=helloworld
</pre>

Ignore DEBUG messages and examine the last line of output.
It should be similar to the following:

<pre>PhantomJS 1.9.2 (Linux): Executed 1 of 1 SUCCESS (0.4 secs / 0.008 secs)</pre>

The test runner informed us that our test passed.
Yay!

If you want to run the test for all patterns,
run the <code>make test</code> command with no parameters:

<pre>
$ make test
</pre>

You might have noticed that when tests complete, the <code>make test</code> command does not terminate.
That's because it ran [Karma](http://karma-runner.github.io/),
a powerful JavaScript test runner,
behind the scenes.
Karma launched a process which now monitors our pattern code and tests for changes.

With Karma still running,
try changing the _patterns/hello/pattern.js_ file so that the HelloWorld pattern changes the label text to something other than _"Hello, world!"_.
Karma will detect the change and automatically re-run the test(s) which will now, of course, fail.
If you now change the _tests/pattern-helloworld-test.js_ so that it will accept the new behavior of the HelloWorld pattern,
Karma will automatically re-run the tests, which will now again pass.

Another nice thing about Karma is that you can connect to the test runner with a browser, too.
Visit [http://localhost:9876](http://localhost:9876) and watch what happens in the console window.
Search for a line resembling the one below:

<pre>
&hellip;
INFO [Firefox 25.0.0 (Ubuntu)]: Connected on socket IH_Zu1A3ZL27f5IBYKnr
&hellip;
</pre>

When Karma detects that a browser has connected to it,
it runs all the tests _in that particular browser_!
Isn't that great?
It allows you to quickly test the behavior of a pattern in many different browsers.
When you make a change,
Karma will automatically run the tests for all the browsers currently connected to it.

Oh, just more more thing -
at this point some of you might be wondering,
what browser Karma used the first time we ran the <code>make test</code> command,
when we had not yet connected to _localhost:9876_ without a browser?

The answer is [PhantomJS](http://phantomjs.org/).
It's a WebKit-based "browser" without a user interface,
but with a JavaScript API for communicating with it.

## Deployment

To wrap up everything,
we just need to add a couple of words on deployment.
When you're done with development,
you somehow need to share your code with other people who might want to use it in their projects or in production environments.

We have already mentioned the <code>make bundle-widgets</code> command.
It bundles all the patterns and their dependencies into a single JavaScript file _widgets.min.js_ located in the _build_ subdirectory.
After a successful build all you have to do is copy this file to wherever you need it and link to it in your HTML pages -
just like we did in _hello.html_ earlier.

### Using Buildout

[Buildout](http://www.buildout.org) is a Python based build system.
If you want to develop patterns in the context of a larger project,
you have an option to include them in development mode using buildout.
This way you will not have to re-bundle them every time you make a change.
To achieve that,
add the Plone Mockup project as a dependency to your buildout config file,
something like below:

**buildout.cfg:**

<pre>
[buildout]
extensions = mr.developer
&hellip;
parts +=
    mockup
&hellip;
auto-checkout +=
    mockup
&hellip;
eggs +=
    mockup
&hellip;
[mockup]
recipe = collective.recipe.cmd
on_install = true
on_update = true
cmds =
    cd ${buildout:sources-dir}/mockup
    make bootstrap
&hellip;
[sources]
mockup = git https://github.com/plone/mockup
</pre>

## Development Tips

### Use the Unbundled Code

It's not much fun to run `make bundle-widgets` every time we want to update our code.
It also makes it difficult to debug, since it has been minified.
Let's set up our html page to use the source instead of the bundle.
We need to include require.js and our js/config.js and then we need to scan the page to initialized mockup patterns.

**hello.html:**

<pre>
&lt;!DOCTYPE html&gt;
&lt;html&gt;
  &lt;head&gt;
    &lt;title&gt;Hello World Pattern&lt;/title&gt;
    &lt;script src="node_modules/requirejs/require.js"&gt;&lt;/script&gt;
    &lt;script src="js/config.js"&gt;&lt;/script&gt;
    &lt;script&gt;
       require(['jquery', 'pat-registry','mockup-patterns-helloworld'],
         function($, registry) {
           $(document).ready(function (){
             registry.scan($('body'));
           });
       });
     &lt;/script&gt;
  &lt;/head&gt;

  &lt;body&gt;
    &lt;label class="pat-helloworld"&gt;(no greeting yet)&lt;/label&gt;
  &lt;/body&gt;
&lt;/html&gt;
</pre>

## HowTo: Convert a jQuery Plugin to a Pattern

jQuery plugins can easily be used as Mockup Patterns.
Let's convert a jQuery plugin called [Foggy](http://nbartlomiej.github.io/foggy) to a pattern.
`Foggy` makes elements blurry and has support for older browsers.

### Get it and Put it into the lib/ Folder

<pre>
$ wget https://raw.github.com/nbartlomiej/foggy/foggy-1.1.1/jquery.foggy.min.js
$ mv jquery.foggy.min.js lib/
</pre>

### Create a Wrapper Pattern

**patterns/foggy/pattern.js:**

    define([
      'jquery',
      'pat-base',
      'jquery.foggy'
    ], function ($, Base) {
      'use strict';

      var Foggy = Base.extend({
        name: 'foggy',
        init: function () {
          this.$el.foggy();
        }
      });

      return Foggy;
    });

### Register the Pattern and the jQuery Plugin

Note, we need to map the jquery.foggy Pattern name to the path and we also need to add it to the `shim` section so `RequireJS` can find it.

**js/config.js:**

<pre>
    &hellip;
      var requirejsOptions = {
        baseUrl: './',
        paths: {
          &hellip;
          'mockup-patterns-foggy': 'patterns/foggy/pattern.js',
          'jquery.foggy': 'lib/jquery.foggy.min'
      },
      shim: {
          &hellip;
          'jquery.foggy': { },
          &hellip;
      },
    &hellip;
</pre>

### Use it!

<pre>
&lt;!DOCTYPE html&gt;
&lt;html&gt;
  &lt;head&gt;
    &lt;title&gt;Foggy Pattern&lt;/title&gt;
    &lt;script src="node_modules/requirejs/require.js"&gt;&lt;/script&gt;
    &lt;script src="js/config.js"&gt;&lt;/script&gt;
    &lt;script&gt;
       require(['jquery', 'pat-registry','mockup-patterns-foggy'],
         function($, registry) {
           $(document).ready(function (){
             registry.scan($('body'));
           });
       });
     &lt;/script&gt;
  &lt;/head&gt;
  &lt;body&gt;
    &lt;div class="pat-foggy"&gt;
      &lt;img src="http://fc05.deviantart.net/fs70/i/2013/321/4/e/doge_powerpoint_by_buraiyen4880-d6ukedg.jpg"/&gt;
      so fog
    &lt;/div&gt;
  &lt;/body&gt;
&lt;/html&gt;
</pre>

### Add Configuration Options

`Foggy` lets you set the blur radius in pixels,
so we can add support for that to the Pattern.

**patterns/foggy/pattern.js:**

    var Foggy = Base.extend({
      name: 'foggy',
      defaults: {blurradius: "20"},
      init: function () {
        this.$el.foggy({blurRadius: this.options.blurradius});
      }
    });

**foggy.html:**

<pre>
  &lt;div class="pat-foggy"&gt;
    &lt;img data-pat-foggy-blurradius="100"
         src="http://fc05.deviantart.net/fs70/i/2013/321/4/e/doge_powerpoint_by_buraiyen4880-d6ukedg.jpg"/&gt;
  &lt;/div&gt;
</pre>

## Additional Resources

### Presentations / Talks

-   [An introductory talk](http://www.youtube.com/watch?v=RqUn3n4HuMM)
    about Plone Mockup -
    about the project and its goals,
    setting up a development environment,
    Patterns explained, testing JavaScript with the Mocha library,
    compiling and deploying widgets, etc.
    (recorded Hangout session from the Pacific Rim Sprint, Sep 13, 2013)  
    Video length: 58:05
-   [Time to Learn JavaScript](https://www.youtube.com/watch?v=Su-Khylo2oA)
    A presentation given by Rok Garbas at the Plone Wine and Beer Sprint,
    Munich, March 2014.
    This is geared towards Plone and Python web developers who aren't yet so familiar with JavaScript.  
    Video length: 1:20:00
