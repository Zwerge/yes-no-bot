'use strict';

var Slackbot = require('slackbots');
var request = require('request');

var bot = new Slackbot({
  token: 'xoxb-36886837493-JQE3hBDVaVxswm0OQ5n61Nkx',
  name: 'Yes/No bot'
});

Slackbot.prototype.start = function () {
  this.on('message', this._onMessage);
};

Slackbot.prototype._onMessage = function (message) {
  if (this._isToMe(message)) {
    var replyTo = message.channel[0] === 'C' ? this._getChannelByID(message.channel) : this._getUserByID(message.user)

    if (replyTo) {
      this._getApiResponse(replyTo);
    }
  }
};

Slackbot.prototype._isToMe = function (message) {
  if (message.text) {
    return message.text.indexOf(this.self.id) > -1;
  }
};

Slackbot.prototype._getUserByID = function (id) {
  var l = this.users.length;
  while (l--) {
    if (this.users[l].id === id) {
      return this.users[l];
    }
  }
};

Slackbot.prototype._getChannelByID = function (id) {
  var l = this.channels.length;
  while (l--) {
    if (this.channels[l].id === id) {
      return this.channels[l];
    }
  }
};

Slackbot.prototype._getApiResponse = function (recipient) {
  var self = this;

  return request.get('http://yesno.wtf/api')
    .on('response', function (res) {

      var buffer = new Buffer('');
      res.on('data', function (chunk) {
        buffer = Buffer.concat([buffer, chunk]);
      });
      res.on('end', function () {
        var data = JSON.parse(buffer);

        self.postTo(recipient.name, data.answer.toUpperCase(), {
            attachments:[{
              fallback: data.answer,
              image_url: data.image
            }],
            as_user: true
        });
      });
    });
};

bot.start();
