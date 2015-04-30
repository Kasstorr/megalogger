var expect = require('chai').expect;
var sinon = require('sinon');
var MegaLogger = require('../lib/megaLogger');

//Create/restore Sinon stub/spy/mock sandboxes.
var sandbox = null;

beforeEach(function() {
    sandbox = sinon.sandbox.create();
});

afterEach(function() {
    sandbox.restore();
});

describe('getLogger', function() {
    var logger = MegaLogger.getLogger("parent");

    it('child logger of parent', function() {

        var childLogger = MegaLogger.getLogger(
            'child',
            {
                'minLogLevel': function() { return MegaLogger.LEVELS.DEBUG; }
            },
            'parent'
        );
        sandbox.spy(console, 'log');
        var message = "Hello, little one.";
        childLogger.log(message);
        expect(console.log.callCount).to.eql(1);
        var consoleArgs = console.log.getCall(0).args;
        expect(consoleArgs[0]).to.match(/parent:child - LOG/);
        expect(consoleArgs[2]).to.eql(message);
    });
});

describe('log', function() {
    var lastError = null;
    var logger = MegaLogger.getLogger("test", {
        onError: function() {
            lastError = arguments;
        },
        'minLogLevel': function() { return MegaLogger.LEVELS.DEBUG; }
    });

    it('can log a message', function() {
        sandbox.spy(console, 'log');
        logger.log("hey!");
        expect(console.log.callCount).to.eql(1);
    });

    it('can log a message to call callbacks', function() {
        sandbox.spy(console, 'error');
        logger.error("hey hey!");
        expect(console.error.callCount).to.eql(1);
        expect(JSON.parse(lastError[0])[2]).to.eql("hey hey!");
    });
});