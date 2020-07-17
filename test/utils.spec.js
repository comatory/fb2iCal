const { expect } = require('chai')

const utils = require('../lib/utils')

describe('utils', () => {
  describe('URL validity', () => {
    it('should specify URL is valid if it\'s valid URL', () => {
      expect(utils.checkValidURL('http://abc.xyz')).to.be.true
    })


    it('should specify URL is valid if input contains only numbers', () => {
      expect(utils.checkValidURL('123')).to.be.true
    })


    it('should specify URL is not valid if input does not contain ' +
       'numbers or valid URL', () => {
       expect(utils.checkValidURL('http://invalid')).to.be.false
    })


    it('should specify valid URL with http protocol', () => {
      expect(utils.checkURLFormat('http://abc.xyz')).to.be.true
    })


    it('should specify valid URL with https protocol', () => {
      expect(utils.checkURLFormat('https://abc.xyz')).to.be.true
    })


    it('should specify valid URL without protocol', () => {
      expect(utils.checkURLFormat('abc.xyz')).to.be.true
    })


    it('should specify valid URL with www protocol', () => {
      expect(utils.checkURLFormat('www.abc.xyz')).to.be.true
    })


    it('should specify valid URL with query parameters', () => {
      expect(utils.checkURLFormat('https://abc.xyz/?a=1&b=2')).to.be.true
    })


    it('should specify valid URL with trailing slash', () => {
      expect(utils.checkURLFormat('https://abc.xyz/')).to.be.true
    })


    it('should specify invalid URL when no TLD present', () => {
      expect(utils.checkURLFormat('https://abc')).to.be.false
    })


    it('should specify invalid URL when protocol uses single slash', () => {
      expect(utils.checkURLFormat('https:/abc')).to.be.false
    })


    it('should specify invalid URL with query parameters and no trailing slash', () => {
      expect(utils.checkURLFormat('https://abc.xyz?a=1&b=2')).to.be.false
    })


    it('should specify validity based on string containing only numbers', () => {
      expect(utils.checkNumberURLParameter('123')).to.be.true
    })


    it('should specify invalid result based on string containing not only numbers', () => {
      expect(utils.checkNumberURLParameter('http://123')).to.be.false
    })
  })

  describe('generating URLs', () => {
    it('should create mobile URL', () => {
      expect(utils.createMobileURL('https://facebook.com/events/145aea'))
        .to.equal('https://mobile.facebook.com/events/145aea')
    })


    it('should create mobile URL from any domain', () => {
      expect(utils.createMobileURL('https://acme.com/xyz'))
        .to.equal('https://mobile.facebook.com/xyz')
    })


    it('should create mobile URL with port number', () => {
      expect(utils.createMobileURL('https://acme.com/xyz:1234'))
        .to.equal('https://mobile.facebook.com/xyz:1234')
    })


    it('should create mobile URL with hash', () => {
      expect(utils.createMobileURL('https://acme.com/xyz#abc'))
        .to.equal('https://mobile.facebook.com/xyz#abc')
    })


    it('should add missing protocol  to mobile URL', () => {
      expect(utils.createMobileURL('facebook.com/events/145aea'))
        .to.equal('https://mobile.facebook.com/events/145aea')
    })


    it('should not modify URL if URL is valid', () => {
      expect(utils.createURL('https://xyz.cz')).to.equal('https://xyz.cz')
    })


    it('should create facebook URL if event number is passed', () => {
      expect(utils.createURL('123')).to.equal('https://facebook.com/events/123')
    })


    it('should create empty string if event number or valid URL is not ' +
       'passed as parameter', () => {
      expect(utils.createURL('abc')).to.equal('')
    })


    it('should create mobile facebook URL based on event number', () => {
      expect(utils.getNormalizedUrl('123'))
        .to.equal('https://mobile.facebook.com/events/123')
    })


    it('should create mobile facebook URL based on URL', () => {
      expect(utils.getNormalizedUrl('acme.com/xyz/abc/'))
        .to.equal('https://mobile.facebook.com/xyz/abc/')
    })
  })

  describe('errors', () => {
    it('should create instance of error', () => {
      expect(utils.createParserError()).to.be.instanceOf(Error)
    })


    it('should create instance of error with message', () => {
      expect(utils.createParserError().toString())
        .to.equal('Error: Unable to parse event data.')
    })


    it('should create instance of error with 422 status code', () => {
      expect(utils.createParserError().statusCode)
        .to.equal(422)
    })
  })
})
