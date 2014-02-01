# Code conventions

It's still on TODO list to write this down, but for now make sure you keep
jshint job happy.

To run jshint on mockup code you have to type: ```make jsint```.


# Git workflow / branching model

It is important that you *NEVER* commit to master directly. Even for the
smallest and most trivial fix. *ALWAYS* send pull request and ask somebody else
to merge your code. *NEVER* merge it yourself.

If you dont get feedback on your pull request in a day please come to
```#plone-framework``` and ping ```@garbas``` or ```@vangheem``` about it.

Main goal of this process is not to boss developers around and make their live
harder, but to bring bigger stability to development of mockup and to make
releases smooth and predictable.


# Pull request checklist

Checklist of things that every person excepting pull request should follow (or
else @garbas will make you drink mongolian coctail - I promise!).

 - Title and description of pull request *MUST* be descriptive and needs to
   reflect changes in code. Please review line by line and comment if code
   change was not mentioned in description of the pull request.

 - Copy the title of pull request to current ticket tracking changes for
   realease under development. (example:
   https://github.com/plone/mockup/issues/250)

 - Full test suite (running test on saucelabs against real browsers) will only
   be triggered for master branch and pull requests. It is important that tests
   pass before you merge it.

   Please note that sometimes travis job hangs due to many reasons and you need
   to restart it.

   Due to some bugs on Travis reporting of status be sure to always check on 
   https://travis-ci.org/plone/mockup/pull_requests if the tests really passed.

 - It is important never to lower code coverage. Check it on [coveralls]( 
   https://coveralls.io/r/plone/mockup) if coverage dropped. It should be
   automaticaly reported once tests are passing.
   
   Also make sure that every new function (or bigger chunk of code) that enters
   mockup is tested.

 - All commits need to be rebased on current master and squashed into one
   single commit. Commit's title (first line) and description (row 3 and below)
   should be identical to pull request.

 - If all of the above is checked, go ahead and merge pull request. Make sure
   you always use a polite tone and explain why this is needed by linking to
   this document.


# Changing this page

When changing this document, it must be done in public with a possibility for
other to comment or at least to be aware of the changes.

Create a pull request with proposed changes and describe reasoning why change
is needed.
