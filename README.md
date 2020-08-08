Hi :)
I'm Sina

This project is done with node js, mongodb and redis

You should run 'server/index.js' to run the project
in 3 services
- user: this is for user registrations and user management
- urlShortener: this is for hanlding url shortening and also redirecting public users to shortened urls
- visitSummary: this is for running cron jobs for calculating weekly and monthly summaries and all related things to "summary"

Authentication is done in server side using Jwt tokens.
And we got 4 api patterns:

### /users
- is used for registration and authentication of user
### /url-shortener
- is used for shortening urls from registered users
### /public
- is used for public user that enter shortened urls and should be redirect to main url
### /summary
- is used for get summaries of shortened urls that registered user created
- this is calculated just for urls visits, i didnt have enough time to implement that part that should show summary of unique users that have seen this shortened url.
- But as a solution for that, I wanted to use ip of requester as user identifier. that i couldnt implement it.
- We could have IpUsers and should query in it to find number of unique users visited that url.
- Another solution and best solution as i think is using cookies to find out public users . (by using cookies, we can understand that if a user get redirected with his laptop or mobile could be a unique user not two different users.
- i could not implement this part cause of lack of time and my condition

###Synchronizer
- to creating summaries, we have 2 cron jobs that should be done:
- hourly synchronizer: as users visit different shortened urls, we log this visits data in mongo as "visits" collection and every hour this cron job reads last 1 hour logs (better to say from last log that is not added to summary that id of last log is saved in "lastUpdatedVisits" collection) and process this visits data to add to shortened url summary.

- dailty synchornizer: every night at 23:59:59 we should update weekly and monthly summaries. so we should drop the 30 days ago visits for monthly and 7 days ago for weekly, and add passed day visits to them summaries.


###benchmark
- I could not implement benchmark cause of lack of time. but it could be implemented via 'benchmark' tool that is for node js.
- the whole work to do is implement suites to send requests to server as mentioned in task (5, 85, 10)
- and find out system performance.