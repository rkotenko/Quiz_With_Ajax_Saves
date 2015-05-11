Quiz_With_Ajax_Saves
====================

All done.  The look is not polished as CSS is not my forte and not my goal here.

Saving user scores and top scores to files.  Quiz is all done with Qunit testing and saving of scores to files.  Now that I have finished, I can reflect on things I would do differently, specifically with Qunit.

While I like Qunit for testing of functions and methods, I had to manipulate it more to test the UI.  QUnit is meant for  atomic testing (as unit testing should be).  However, I needed to test how a user would move through the quiz.  This involved tests which depend on the state created by the previous state.  It would have been possible to do some setup inside of each test to move the application into the correct state for each test, but that would have added a lot of code to each one and would have been prone to errors in itself.  My solution was to save the state of the #qunit-fixture after the test was complete (but within the test function) to a global variable.  I could then use this state as the setup for the next consecutive tests by inserting into the html page.  Thus, the next test could continue on with the flow of the program.  It may not be the most elegant solution, but it worked pretty well and the app was pretty much working correctly when I ran it (minus some spots I missed in testing).  Still, I feel like there is a better way out there to test UI.  It shall have to be researched.

I should have created tests for the back end itself.  By doing that and so knowing they work correctly, I could have mocked my ajax calls and not had to reset my data after running the tests.
  
Overall, after reading a post on the Fluencia engineering blog, Mocha, Chai, and Sinon seem very interesting.  I will probably look to using them for when this is converted to node and backbone.
  
  
