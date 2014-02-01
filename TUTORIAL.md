# Introduction

CAUTION: this is a work in progress. Things might change without advance notice
and errors in the docs are possible. You have been warned. ;-)

Assuming you successfully set up your development environment as described
under the [Getting Started](#getting-started) section, you are now ready to
write your first pattern!

Unless stated otherwise the <em>mockup</em> directory (the one that you
cloned the repository into) will be our root working directory throughout this
tutorial and all the paths and filenames are specified **relative** to it.

The mockup directory on your filesystem filesystem should look like the
following (NOTE: most of the files and folders have been omitted for brevity):

<pre>
mockup/
  js/
    bundles/
      widgets.js
    patterns/
    ui/
    config.js
  less/
  lib/
  plone/
    mockup/
  tests/
  bower.json
  Gruntfile.js
  package.json
  &hellip;
</pre>
<strong>(XXX: test on a fresh instance if correct!)<br>
XXX: needed at all? it just occupies a lot of space ...</strong>


<h2>Creating a New Pattern</h2>
<p>Our Hello World pattern will be very simple - all it will do is change the text
of some HTML label to "Hello, World!". So let's get started!</p>

<h3>Defining the Pattern</h3>

<p> The first step is to go to the <em>js/patterns</em> subdirectory and create
a file called <em>hello.js</em> in it with the following contents:</p>

<pre>
<strong>define</strong>([
    'jquery',
    <strong>'mockup-patterns-base'</strong>
], function ($, Base) {
    "use strict";

    var HelloWorld = <strong>Base.extend</strong>({
        name: 'helloworld',
        <strong>init</strong>: function () {
            var $label = <strong>this.$el</strong>;
            $label.text("Hello, world!");
        }
    });

    <strong>return HelloWorld;</strong>
});
</pre>
<strong>XXX: syntax highlighting?</strong>

<p>
The file contains a call to the RequireJS's
<a href="http://requirejs.org/docs/api.html#define">define()</a> function, which
(unsurprisingly) defines a new JavaScript code module. We pass two parameters
to it:</p>
<ol>
  <li>An array containing the names of module's dependencies. We state that we
  depend on jQuery and the base Mockup pattern module.</li>
  <li>A function which returns an object that defines our <em>Hello World</em>
  module.</li>
</ol>

<p>When called this function is passed all the objects representing the module's
dependencies (in the same order as defined in the dependency list). This allows us
to use these dependencies in our module's code.</p>

<p>The way to actually create a new module is to call the <strong>Base.extend()</strong>
method and pass the module definition to it. The latter is just an object with
some properties, and as you can see the object describing our Hello World pattern is
in fact very simple. It only contains a <var>name</var> property definining its name
and an <strong>init()</strong> method. The latter does the actual work of changing
the label's text to <em>"Hello, world!"</em>.</p>

<p>You might be wondering what the <code>this.$el</code> construct stands for. It is
just a reference to the DOM element on which the pattern has been invoked. In this
context <code>this</code> points to the pattern object itself, while its attribute
<code>$el</code> is a jQuery object wrapping that DOM element (or sometimes a subtree
of DOM elements).</p>


<h3>Pattern Registration</h3>

<p>In order to use the pattern we need to tell the bundling machinery where to find
it and to start including it in the JavaScript bundles we create. So first open the
file <em>js/config.js</em> and add the following line under <em>paths</em>
definitions (omit the trailing comma if adding to the end of the paths list):</p>
<pre>
'mockup-patterns-helloworld': 'js/patterns/hello',
</pre>

<p>This tells the bundling/packaging machinery that a module called
<em>mockup-patterns-helloworld</em> is defined in the file <em>hello.js</em> under the
<em>js/patterns</em> subdirectory (relative to where config.js is located). Note that
we omit the file's .js suffix in the path definition.</p>

<p>To tell the machinery to include our pattern in the bundles, open the
<em>js/bundles/widgets.js</em> file and add the <em>mockup-patterns-helloworld</em>
to the list of dependencies passed to the <em>define()</em> function.
<br>
<strong>XXX: this is probably widgets-specific and will change after refactoring.
Update this section at that point.</strong>
</p>

<pre>
define([
  'jquery',
  &hellip;
  <strong>'mockup-patterns-helloworld',</strong>
  &hellip;
], &hellip;)
</pre>

<p>For the dependency we use the same name as already used in the pattern path
definition.<br>
As we learned in the Defining a Pattern section above, we also have to add a
corresponding HelloWorld parameter to the function passed to the <em>define()</em>
as the second argument. Make sure that parameter's relative position matches the
relative position of the <em>mockup-patterns-helloworld</em> in the dependency list.
</p>

<pre>
function($, Registry, &hellip;, <strong>HelloWorld</strong>, &hellip;) {
    &hellip;
}
</pre>

<p>We now have everything ready to create a JavaScript bundle containing our
Hello World pattern. From the &lt;mockup&gt; directory run the following console
command:</p>

<pre>
$ make bundle-widgets
</pre>

<p>This determines all the dependecies and bundles them up into a single
file called <em>build/widgets.min.js</em>. It also copies some additional
resources (e.g. images and CSS files) to the same <em>build</em> directory.</p>


<h3>Using the Pattern on a Page</h3>

<p>Now that we have defined, configured and bundled our Hello World pattern, it's time
to use it and see how it works. Inside the root "mockup" directory create a simple HTML
file called <em>hello.html</em> with the following contents:</p>

<pre>
&lt;!DOCTYPE html&gt;
&lt;html&gt;
  &lt;head&gt;
    &lt;meta charset="utf-8"&gt;
    &lt;title&gt;Hello World Pattern&lt;/title&gt;
    &lt;script type="text/javascript" src="bower_components/jquery/jquery.js"&gt;&lt;/script&gt;
    &lt;script type="text/javascript" src="<strong>build/widgets.min.js</strong>"&gt;&lt;/script&gt;
  &lt;/head&gt;

  &lt;body&gt;
    &lt;label class="<strong>pat-helloworld</strong>"&gt;(no greeting yet)&lt;/label&gt;
  &lt;/body&gt;
&lt;/html&gt;</pre>
<strong>XXX: markup highlighting?</strong>

<p>In the head we first include jQuery and <em>widgets.min.js</em> generated in the
previous step. The body of the document contains a label with some placeholder text.
The important thing here is its <strong>pat-helloworld</strong> CSS class. It tells
the <em>helloworld</em> pattern that it should perform its work on this particular
DOM element. This, by the way, is the general way of triggering the patterns - you
add a CSS class pat-&lt;pattern-name&gt; to the desired elements and the pattern
&lt;pattern-name&gt; will be executed on them.</p>

<p>In case we want to apply more than one pattern to a single DOM element, we can
simply assign multiple <em>pat-*</em> CSS classes to it.</p>

<p>To test the Hello World pattern open the <em>hello.html</em> file with your
browser directly from the filesystem and you should see "Hello, world!" displayed.
This text is different from the original label text - our Hello World pattern
automatically changed it.</p>


<h2>Adding Configuration Options to a Pattern</h2>

<p>Patterns can provide various configuration options for customizing their
appearance and/or behavior. Let's modify our Hello World pattern so that it will
allow us to change the label's font color and its background color.</p>

<p>We first need to update the pattern definition in <em>js/patterns/hello.js</em>:</p>

<pre>
var HelloWorld = Base.extend({
    name: 'helloworld',
    <strong>defaults: {
        'color': 'black',
        'bgcolor': 'yellow'
    },</strong>
    init: function () {
        var $label = this.$el;
        $label.text("Hello, world!");
        <strong>$label.css({
            'color': this.options.color,
            'background': this.options.bgcolor
        });</strong>
    }
});
</pre>

<p>We added a new attribute called <strong>defaults</strong> to the object
describing the Hello World pattern. The value of this attribute is another object
containing the <em>&lt;option-name&gt;: &lt;default-value&gt;</em> pairs, which
should be pretty self-explanatory.</p>

<p>In the <em>init()</em> method we added a code which sets the label's font and
background color as defined by the pattern configuration options. Option values can be
read through the <em>this.options</em> object (with <em>this</em> pointing to the
object describing the pattern).</p>

<p>NOTE: Since we have changed the pattern's code we need to run the
<code>make bundle-widgets</code> command from the console again, so that the JavaScript
bundle will contain the enhanced version of the Hello World pattern we just created.</p>

<h3>The <em>data-pat-&lt;pattern-name&gt;</em> Attribute</h3>

<p>To see the changes in action, we slightly modify the <em>hello.html</em> file. The
&lt;body&gt; should now contain the following:</p>

<pre>
&lt;label class="pat-helloworld"
    <strong>data-pat-helloworld="color:white; bgcolor:black"</strong>&gt;(no greeting yet)&lt;/label&gt;
&lt;br&gt;
&lt;label class="pat-helloworld"
    <strong>data-pat-helloworld="color:green"</strong>&gt;(no greeting yet)&lt;/label&gt;
</pre>

<p>And the result of the change:</p>
<span style="color:white; background:black; cursor:default">Hello, world!</span><br>
<span style="color:green; background:yellow; cursor:default">Hello, world!</span><br><br>


<p>We added another label and defined the <strong>data-pat-helloworld</strong>
attribute on both. The <em>data-pat-&lt;pattern-name&gt;</em> attribute is used
to pass configuration options to the pattern (<em>color</em> and <em>bgcolor</em>
in our case). If some of the options are not provided, their corresponding default
values are used (as defined by the pattern). This is why the second label gets
a yellow background even though we haven't explicitly specified it.</p>

<p>If you wonder whether it is possible for a DOM element to have more than
one <em>data-pat-*</em> attribute defined, the answer is of course YES, because
multiple patterns can be applied to a single DOM element at the same time.</p>

<h3>Options Format</h3>

<p>There are two different ways to specify the option values in <em>data-pat-*</em>
attributes, the key:value format and the JSON dictionary format.</p>

<h4>Key : Value</h4>
<p>This is the format we used in the example above. Each key represents the option
with the same name, while the corresponding value is, well, the option's value. The
key and the value are separated with a colon (:) and a semicolon (;) is used to
separate multiple <em>key:value</em> pairs.</p>

<h4>JSON Dictionary</h4>
<p>This format, too, uses the <em>key:value</em> pairs, but they are passed in
a JSON dictionary, like this: <code>data-pat-helloworld="{color:white, bgcolor:black}"</code></p>

<p>Generally it doesn't really matter which of the two formats you use. In most
cases it is simply a matter of personal preference. There is, however, one notable
advantage of the JSON format - the option values are not limited to just strings and
numbers, they can also be arbitrary JSON-compatible structures (even nested).
Sometimes when a pattern expects a complex configuration, JSON format is your
only choice.</p>

<h3>Nesting the Options</h3>
<p>Setting the same options for many different elements over and over again can be a
tedious task. It also makes it more difficult to globally change such options later.
Luckily the patterns provide a mechanism to avoid problems like these and that is
<em>option nesting</em>. It works as follows - you can define a <em>data-pat-*</em>
attribute on an element somewhere in the DOM hierarchy and all its descendants
(at all levels) will <em>inherit the option values</em> listed there! This is
quite a useful feature indeed.</p>

<p>Suppose we modify the <em>&lt;body&gt;</em> tag in our <em>hello.html</em>
page and add <em>data-pat-helloworld</em> attribute to it:</p>

<pre>
&lt;body <strong>data-pat-helloworld="bgcolor:orange"</strong>&gt;
</pre>

<p>Suddenly all the elements using the Hello World pattern will get an orange
background by default, even though the true default background color as defined by
the pattern is yellow. Elements can override this behavior by explicitly providing
ther own value for the <em>bgcolor</em> option.</p>

<p>If you now reload the <em>hello.html</em> file in your browser, you should see
the following:</p>
<span style="color:white; background:black; cursor:default">Hello, world!</span><br>
<span style="color:green; background:orange; cursor:default">Hello, world!</span><br><br>

<p>The bottom of the two labels now indeed has an orange background, because that's
the option value that an element further up the hierarchy provides. On the other
hand the background color of the upper label remains black, because that label
provides its own value for the <em>bgcolor</em> option, overriding the value set
by the <em>&lt;body&gt;</em> tag. We can see that the option values defined at lower
levels have precedence over those defined higher up the DOM tree.</p>



<h2>Writing Tests</h2>
<p>It's true that our Hello World pattern is very simple and doesn't contain
any obscure bugs, but with more complex patterns you can never be sure. And even
if they work flawlessly at the moment, there's always a chance of introducing bugs
when adding new features or refactoring the existing ones. This is where the tests
come in. They can automatically run the patterns in different usecase scenarios and
make sure they behave as expected.</p>

<h3>Defining a Test Module</h3>

<p>All tests are placed in the <em>tests</em> subdirectory and the names of the files
containing them must match the <em>*-test.js</em> pattern. It is a good practice to
name the files after the pattern they test. Since we want to test the Hello World
pattern, we create a file called <em>tests/pattern-helloworld-test.js</em> and put
the following code into it:</p>

<pre>
define([
    <strong>'chai',</strong>
    'jquery',
    <strong>'mockup-registry',</strong>
    <strong>'mockup-patterns-helloworld'</strong>
], function (chai, $, registry, HelloWorld) {
    "use strict";

    var expect = chai.expect,
        <strong>mocha = window.mocha;</strong>

    <strong>mocha.setup('bdd');</strong>

    <strong>$.fx.off = true;</strong>  //disable jQuery animations for various reasons

    <strong>describe</strong>("HelloWorld", function () {
        <strong>beforeEach</strong>(function () {
            this.$el = $(
                '&lt;label class="pat-helloworld"&gt;(no greeting yet)&lt;/label&gt;'
            );
        });

        <strong>it</strong>('should change label text to "Hello, world!"', function () {
            expect(this.$el.text()).to.not.be.equal("Hello, world!");
            <strong>registry.scan(this.$el);</strong>
            expect(this.$el.text()).to.be.equal("Hello, world!");
        });
    });

});</pre>
<strong>XXX: we really need syntax highlighting and line numbers &hellip;</strong>

<p>Test modules are defined in a similar way to patterns. We call the <em>define()</em>
function, list the module dependencies and provide a function which contains the actual
test code. Let's first explain some of the dependencies:</p>

<ul>
  <li>
  <strong>chai</strong> - <a href="http://chaijs.com/">Chai</a> is an assertion
  library complementing the <a href="http://visionmedia.github.io/mocha/">Mocha</a>
  test framework, which is what Plone Mockup project uses for tests. The Chai
  library is quite flexible as it allows you to choose your preferred style for
  making assertions in tests. In our example we use the so-called <em>BDD</em> style,
  allowing for assertions such as <code>expect(result).to.be.above(0).and.not.equal(7)</code>.
 </li>

  <li><strong>mockup-registry</strong> - the <em>registry</em> is a collection of tools
  used for managing the patterns. It also keeps track of which patterns have
  been registered, hence its name.<br>
  In our example we use its <strong>scan()</strong> method, which scans the given
  DOM (sub)tree and applies patterns to all DOM elements in the tree where
  applicable.</li>

  <li><strong>mockup-patterns-helloworld</strong> - the pattern under test must
  always be listed among the test dependencies, even if we don't use it directly in
  the test code (as is the case here with our example). The reason is that the
  <em>registry.scan($element)</em> method will apply our pattern to the
  <var>$element</var> only if the pattern is present in the test module's dependency
  list.</li>
</ul>



<p>In the body of the test module we choose the aforementioned
<a href="http://chaijs.com/api/bdd/">BDD style</a> for our assertion statements:
<code>mocha.setup('bdd')</code>. We also disable jQuery animations
(<code>$.fx.off = true</code>) for a couple of good reasons:</p>

<ul>
  <li>Asynchronous animations on DOM elements might finish only after the test case
  has already come to an end. If the latter expects that a pattern changes
  some property of an element, but the change is delayed due to animation, an
  assertion in the test might erroneously fail.</li>
  <li>Speed - in most cases animations are just an eye candy for the users, and
  as such, are not needed during the test runs. Disabling them can sometimes
  considerably cut down the time needed to complete the tests.</li>
</ul>

<h4>The <em>describe()</em> Function</h4>

<p>We define a group of test cases by using the
<a href="http://visionmedia.github.io/mocha/#interfaces">describe()</a> function
found in the aforementioned Mocha test framework. The first parameter is the
name for the test case group, which could be anything, really (and not necessarily
<em>"HelloWorld"</em>). The second parameter is a function containing the actual test
case definitions and/or the definitions of the test case subgroups (yes, we can nest
the <em>describe()</em> function).</p>

<p>In our example we only have a single test case and it is defined by a call to the
<strong>it()</strong> function. We first provide a descriptive name for the test
case, which makes it very easy to see, what this test case expects from the
pattern under test (<em>'It should change label text to "Hello, world!"'</em>).
The second parameter is a function containing the actual test case code. It first
verifies that the label does not yet have the expected text. Then it invokes
the <em>registry.scan()</em> method (to apply the pattern) and after that it checks
again to see, whether the pattern has indeed changed the text to
<em>"Hello, world!"</em>.</p>

<p>The last thing to mention is the <strong>beforeEach()</strong> function. The test
framework calls this function before each test case is run, giving us the
opportunity to perform some initialization and setup work in it. This way we don't
have to repeat the same common initializiation tasks separately in each test case,
resulting in a more readable and maintainable code. In our concrete example, all
that we do in <em>beforeEach()</em> is create a jQuery object representing an HTML
label, which later serves as a convenient test polygon for the Hello World pattern.</p>

<p>Note that regarding the tests, we have only scratched the surface here. Describing
all the options the test framework provides is beyond the scope of this tutorial.
To learn more about how to write tests, please consult Mocha's
<a href="http://visionmedia.github.io/mocha/">documentation</a>.</p>


<h3>Running the Tests</h3>

<p>To run our test run the following console command from the <em>&lt;mockup&gt;</em>
directory:</p>

<pre>
$ make test pattern=helloworld
</pre>

<p>Ignore DEBUG messages and examine the last line of output. It should be
similar to the following:</p>

<pre>PhantomJS 1.9.2 (Linux): Executed 1 of 1 SUCCESS (0.4 secs / 0.008 secs)</pre>

<p>The test runner informed us that our test passed. Yay!</p>

<p>If you want to run the test for all patterns, run the <code>make test</code>
command with no parameters:</p>

<pre>
$ make test
</pre>

<p>You might have noticed that when tests complete, the <code>make test</code> command
does not terminate. That's because it ran
<a href="http://karma-runner.github.io/">Karma</a>, a powerful JavaScript test runner,
behind the scenes. Karma launched a process which now monitors our pattern and
pattern test files for changes.</p>

<p>With Karma still running, try changing the <em>js/patterns/hello.js</em> file so
that the Hello World pattern changes the label text to something else than
<em>"Hello, world!"</em>. Karma will detect the change and automatically re-run the
test(s) which will now, of course, fail. If you now change the
<em>tests/pattern-helloworld-test.js</em> so that it will accept the new behavior of
the Hello World pattern, Karma will once more re-run the tests, which will now again
pass.</p>

<p>Another nice thing about Karma is that you can connect to the test runner with
a browser, too. Visit <a href="http://localhost:9876">http://localhost:9876</a> and
watch what happens in the console window. Search for a line resembling the one
below:</p>

<pre>
&hellip;
INFO [Firefox 25.0.0 (Ubuntu)]: Connected on socket IH_Zu1A3ZL27f5IBYKnr
&hellip;
</pre>

<p>When Karma detects that a browser has connected to it, it runs all the tests
<em>in that particular browser</em>! Isn't that great? It allows you to quickly
test the behavior of a pattern in many different browsers. When you make a change,
Karma will automatically run the tests for all the browsers currently connected to
it.</p>

<p>Oh, just more more thing - at this point some of you might be wondering, what
browser Karma used the first time we ran the <code>make test</code> command, when we
had not yet connected to <em>localhost:9876</em> with any of the browsers?</p>

<p>The answer is <a href="http://phantomjs.org/">PhantomJS</a>. It's a WebKit-based
"browser" without user interface, but with a JavaScript API for communicating
with it.</p>



<h2>Deployment</h2>

<p>To wrap up everything, we just need to add a couple of words on deployment. When
you're done with development, you somehow need to share your code with other people
who might want to use it in their projects or in production environments.</p>

<p>We have already mentioned the <code>make bundle-widgets</code> command. It
bundles all the patterns and their dependencies into a single JavaScript file
<em>widgets.min.js</em> located in the <em>build</em> subdirectory. After a
successful build all you have to do is copy this file to wherever you need it
and link to it in your HTML pages  - just like we did in <em>hello.html</em>
earlier.</p>

<p>If you want to develop patterns in the context of a larger project, you
have an option to include them in development mode. This way you will not have to
re-bundle them every time you make a change. To achieve that, add Plone Mockup
project as a dependency to your <a href="http://www.buildout.org">buildout</a>
config file, something like below:

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
nix_path=~/.nix-defexpr/channels/
cmds =
    cd ${buildout:sources-dir}/mockup
    make bootstrap NIX_PATH=${:nix_path}
&hellip;
[sources]
mockup = git https://github.com/plone/mockup
</pre>


<h2>Additional Resources</h2>
  <li>
    <ul>
     <p>
     <a href="http://www.youtube.com/watch?v=RqUn3n4HuMM"
     target ="_blank">An introductory overview</a>
     of Plone Mockup - about the project and its goals, setting up a development
     environment, Patterns explained, testing JavaScript with Mocha library,
     compiling and deploying widgets, etc. (recorded Hangout session from the
     Pacific Rim Sprint, Sep 13, 2013)</p>

     <p>Video length: 58:05</p>
    </ul>
  </li>

