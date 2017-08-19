A single page web app that helps students from USYD plan their course schedule. The current system makes it difficult to quickly look up other subjects to find out prerequisites, so I wanted to develop an app that aided with that.

Live version is <a href="https://usyd-planner.herokuapp.com/">here</a>.

Front end is handled by Vue.js, which communicates with an Express/Node.js server via Axios. Data is stored in sqlite.

To see its functionality, try adding courses like INFO1905, COMP2129, INFO2315 or CHEM1001.

The data used for this app was obtained with a web scraper that I built in Python. It pulled the HTML for each offered subject and parsed each attribute (credit points, semester offered, prerequisites, etc.), and then inserted it into a sqlite db.

More features are on the way :)
