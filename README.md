#LYPE

LYPE stands for Live Type. It's a single page web application, and it will allow you to create, edit and debug your javascript/coffeescript code directly inside your browser. The main purpose of this app is to provide a "safe" place where experiment and test your code, with live response from the page. It's still a work in progress, but it already have a bunch of useful features.

This project is entirely Open Source. Feel free to browse my code (please, don't judge it), fork my repo. Contributions are greatly appreciated.


###TONS of features.

Here's a complete list of the awesome features provided by Lype. It's still incomplete, a lot of new stuff will be added in the next future.

######Javascript and Coffeescript text editor

Lype provides a smart editor for your javascript or coffeescript code. I didn't create it from scratch, because the 95% of the work was made by the awesome people behind [CodeMirror](http://codemirror.net) and [JSHint](http://jshint.com) and [JBox](http://stephanwagner.me/jBox).

Nope, I didn't just copied a few libraries hoping that they will work fine together. I had to built the "infrastructure" to hold and maintain these amazing libraries (here's the remaining 5% of the editor).

There isn't a autosuggestion feature, right now, but it's planned for the future.

######Tab Support
Yep, you can write your code in different tabs. This is the best way to manage and organize your code, so you will not have a huge mess with a lot of disorganized code. 

Using tabs is really easy: you just have to click on the "+" button, insert a valid filename (lype only accepts ".js" and ".coffee" extensions), and you're good to go to start writing. Of course, you can browse and edit your tabs without problems. 

Tabs are evaluated by Lype in order, from left to right. So if you declare a method, or variable (or whatever), in the first tab, you can use it in the next tabs, but not viceversa. Right now, you can't remove tabs, but this feature will be added in the next future.

######Saving files
Of course, you can save your files. Just press "cmd + s" (if you're using a Mac), or "ctrl + s" (I'm talking to you, random Windows user!). Thanks to [Keypress](http://dmauro.github.io/Keypress/) for this amazing feature.

######Coffeescript compiler
You can write your coffeescript code, click the "compile" button and your code will be available for the entire project. Of course, remember that tabs are evaluated from left to right. 

If you edit an old .coffee tab, you have to click again on "compile" to use the new version.

######Console
This is VERY important. This is the console, where all of your output goes. If you write:
```javascript
	console.log(window);
```
Your console will show you an inspection of the window object, just like you were able to see in Chrome Dev Tools. This feature it's still a work in progress, a lot of improvements are needed.

######Canvas
Ok, we all love CANVAS. We also love WebGL and THREE.js, isn't it? (Well, I do.) Lype provides you the possibility to append/modify/create/destroy/manipulate canvases in the right panel of the application. You can switch between Canvas and Console at any time, by clicking on "canvas" or "console" in the upper right corner.

######Fullscreen
Well, it's not working (right now). It's probably a bug inside Codemirror, but I'm still trying to understand the problem.

######Node-Webkit
Here comes the fun part. I decided to give Lype a standalone version, thanks to the amazing work of Roger Wang behind [Node-Webkit](https://github.com/rogerwang/node-webkit). Supporting Node-Webkit will allow you to use all Nodejs modules. (PRETTY AMAZING, ISN'T IT?)

This is still a work in progress, but if you already have a Node-Webkit environment on your computer, you can download the whole repo and build it by yourself. I will provide all of the needed support to use Lype offline without having to install a Node-Webkit environment.

----

####Future
This application still needs a lot of improvements, and a lot of new features. A short list:

1. Google Chrome Extension. I'd like to create a Google Chrome Extension to perform javascript operations on the fly.

2. Fix Fullscreen mode, it's really buggy.

3. Full THREE.js support.