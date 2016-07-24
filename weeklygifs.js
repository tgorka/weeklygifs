'use strict';

const nodemailer = require('nodemailer');
const request = require('request');


/**
 * Gipgy collector to get url of the random gif animation.
 */
class GiphyCollecter {

    /**
     * Construct the giphy object
     */
    constructor() {
        // giphy url for a random gifs information based on public api_key
        this.url = 'http://api.giphy.com/v1/stickers/random?api_key=dc6zaTOxFJmzC';
    }

    /**
     * Get giphy url of the random animation.
     *
     * @returns {Promise|Promise<T>} for the gif url
     */
    getGiphyUrl() {
        let me = this;
        return new Promise((resolve, reject) => {
            request({
                url : me.url,
                json: true
            }, (error, response, json) => {
                if (!error && response.statusCode == 200 &&
                        json.meta && json.meta.status == 200) {
                    resolve(json.data.image_url);
                } else {
                    reject(Error('Can\'t call Giphy page'));
                }
            });
        });
    }

    /**
     * Get giphy url of the random animation.
     *
     * @param count
     * @returns Array<{Promise|Promise<T>}> for the gif url
     */
    getGiphyUrls(count) {
        let me = this;
        return Promise.all(Array.from(Array(count).keys()).map(
                index => me.getGiphyUrl()
        ).reduce((total, currentValue) => {
            total.push(currentValue);
            return total;
        }, []));
    }
}

/**
 * Mail sender with funny gifs of the week.
 */
class MailSender {

    /**
     * Construct mailer with authentications and list of receivers
     *
     * @param auth string
     */
    constructor(auth) {
        // create transporter
        this.transporter = nodemailer.createTransport(auth);
        // collector
        this.gifCollector = new GiphyCollecter();

    }

    /**
     * Send mail with Gify animations
     *
     * @param receivers list of email adresses
     */
    send(receivers, from, callback) {
        this.composeMail().then(mail => {
            // setup mail options
            let options = {
                from: from, // optional
                to: receivers,
                subject: 'Funny Gifs of the week',
                html: mail.html,
                text: mail.txt
            };
            // send mail
            this.transporter.sendMail(options, (error, info) => {
                if (error) {
                    callback(null, {error: info});
                    return console.log(error);
                }
                console.log('Message sent: ' + info.response);
                callback(null, {status: info});
            });
        }, error => {
            callback(null, {error: info});
        });
    }

    /**
     * Get mail txt.
     *
     * @returns {Promise|Promise<T>} for the composing mail
     */
    composeMail() {
        return new Promise((resolve, reject) => {
            this.gifCollector.getGiphyUrls(5).then(gifs => {
                let txt = 'Hi,\n\n';
                txt += 'This are weekly part of the funny gifs:\n\n';
                txt += gifs.map(gif => gif + '\n').reduce(
                    (total, gif) => total + gif, '');
                txt += '\nBest,\n';
                txt += 'Tomasz';

                let html = 'Hi,<br><br>';
                html += 'This are weekly part of the funny gifs:<br><br>';
                html += gifs.map(gif => '<img src="' + gif + '"><br>').reduce(
                        (total, gif) => total + gif, '');
                html += '<br>Best,<br>';
                html += 'Tomasz';

                resolve({txt:txt, html:html});
            }, error => { reject(error); });
        });
    }
}

/**
 * Export the service to send funny gifs.
 *
 * @param context
 * @param callback
 */
module.exports = function(context, callback) {
    // context.webhook contains the webhook payload provided by GitHub
    // context.data contains URL query and webtask token parameters
    new MailSender(context.data.auth).send(context.data.receivers, context.data.sender, callback);
}
