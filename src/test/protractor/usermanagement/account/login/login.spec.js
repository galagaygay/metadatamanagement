/* global browser */
/* global it */
/* global describe */
/* global by */
/* global element */
/* global expect */
/* global beforeEach */

'use strict';

var htmlContentHelper =
require('../../../utils/htmlContentHelper');
var findBrockenUrls = require('../../../utils/findBrockenUrls');

describe('Login Page', function() {
  function testLogsPage(description, link) {
    describe(description, function() {
      var currentUrl;
      var htmlContent;
      beforeEach(function() {
          browser.get(link);
          browser.getCurrentUrl().then(function(url) {
           currentUrl = url;
         });
          htmlContent = element(by.id('content'));
        });
      it('should check translated strings', function() {
          htmlContentHelper
          .findNotTranslationedStrings(htmlContent, currentUrl)
          .then(function(result) {
            expect(result.length).toBe(0, result.message);
          });
        });
      it('should check reset password link', function(done) {
          htmlContent.all(by.css('a')).then(function(items) {
            items[0].getAttribute('href').then(function(href) {
              return href;
            }).then(function(href) {
              items[0].click().then(function() {
                findBrockenUrls
                .checkStates(href, currentUrl, 'reset password link')
                .then(function(result) {
                  done();
                  expect(result.isValidUrl).toBe(true, result.message);
                });
              });
            });
          });
        });
      it('should check registartion link', function(done) {
            htmlContent.all(by.css('a')).then(function(items) {
              items[1].getAttribute('href').then(function(href) {
                return href;
              }).then(function(href) {
                items[1].click().then(function() {
                  findBrockenUrls
                  .checkStates(href, currentUrl, 'registartion link')
                  .then(function(result) {
                    done();
                    expect(result.isValidUrl).toBe(true, result.message);
                  });
                });
              });
            });
          });
    });
  }
  testLogsPage('with german language', '#/de/login');
  testLogsPage('with english language', '#/en/login');
});