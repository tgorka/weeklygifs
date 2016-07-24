# Weeklygifs
Weekly gif sender rom Giphy using webtask

## Description
Call Giphy page, take 5 random animations and send them as an email to selected receivers using your email box.

## Requirements

- NodeJS (ES6 compatible)
- Webtask CLI (https://webtask.io/cli)
- Email box accesible by the script

## Installation & run

### Webtask
Install script on your webtask account. 
Take care about your email account credentials.
```
wt create https://raw.githubusercontent.com/tgorka/weeklygifs/master/weeklygifs.js \ 
          --name weeklygifs \ 
          --secret auth=MAIL_SMTPS_CREDENTIAL
```

This exmaple is for a gmail account. the MAIL_SMTPS_CREDENTIAL will looks like
```
smtps://GMAIL_USER_NAME%40gmail.com:GMAIL_PASSWORD@smtp.gmail.com
```

After that we have an url:
```
https://webtask.it.auth0.com/api/run/wt-YOUR_ACCOUNT-0/weeklygifs?webtask_no_cache=1
```

After adding parameter of receiver list we will have service that will send package of gifs
```
https://webtask.it.auth0.com/api/run/wt-YOUR_ACCOUNT-0/weeklygifs?webtask_no_cache=1&receivers=EMAIL1,EMAIL2
```

To see logs
```
wt logs
```

And finally to schedule the service to be run every week (Monday at 12.30) we should schedule it
```
wt cron schedule --name weeklygifs \
                 --secret auth=MAIL_SMTPS_CREDENTIAL \
                 --secret receivers=EMAIL1,EMAIL2 \
                 "30 12 * * 1" \
                 https://raw.githubusercontent.com/tgorka/weeklygifs/master/weeklygifs.js
```

At the end to see the croon history
```
wt cron history weeklygifs
```

To see all croon tasks
```
wt cron ls
```

## Release History
+ 1.0.0 - initial final version of the application

## Author
Tomasz Górka <http://tomasz.gorka.org.pl>

## License
&copy; 2016 Tomasz Górka

MIT licensed.
