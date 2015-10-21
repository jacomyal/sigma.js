## sigma.js - how to contribute:

As an open-source project that is maintained by people who cannot work on it on a daily basis, contributions are very welcome! But there are some rules to follow, to prevent maintainers to spend too much time on irrelevant or invalid contributions.

#### Opening a ticket

First, here are some basic rules:

 - Make sure your bug or question has not been addressed in another ticket yet.
 - If your ticket is related to a bug you've met, please add a simple use-case to help the maintainers reproduce the bug.

##### A word about labels

We use three labels to estimate the time a ticket will take us to solve:

 - **cake**: This issue will probably take only some minutes to solve.
 - **steak**: This issue will probably take around one or two hours to solve.
 - **snake**: This issue will probably take more than two hours to solve.

#### Submitting a pull-request

##### What can be submitted

First, sigma has been designed as a tool. Since two network visualization applications will have different features and interactions if they are developed by different people or for different use cases, the potentially needed features are countless.

So, sigma aims to make it possible for developers to implement the features they need for their applications through its API, but should not contain itself these features.

So, basically:

 - If your feature can be implemented with sigma, then you can submit it as a plugin, to help other people use it easily.
 - If for some reason you needed to modify sigma to implement your feature, you can submit these modifications to improve sigma.

But:

 - If you submit new features in sigma that can be developed as plugins, they will probably not be accepted.

##### Some basic rules

If you submit modifications to sigma, please ensure that:

 1. the unit tests still pass
 2. your code respect JSHint and ClosureLint rules
 3. you cleaned your code from commented lines, logs, alerts or other debugging related code.

You can check these rules by running `grunt` in sigma's directory from your command line.

Also, if you submit a plugin, please add an example that shows how the plugins works and what it does.
