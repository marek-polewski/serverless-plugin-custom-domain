'use strict';

const test = require('ava');

const Plugin = require('..');

test.beforeEach(t => {
  t.context.template = {
    Resources: {}
  };
  t.context.serverless = {
    version: '1.13.2',
    getProvider: () => null,
    service: {
      provider: {
        compiledCloudFormationTemplate: t.context.template
      },
      custom: {
        domain: 'foo.com'
      }
    }
  };
  t.context.plugin = new Plugin(t.context.serverless, {
    stage: 'test'
  });
});

test('custom-domain adds hooks', t => {
  t.deepEqual(Object.keys(t.context.plugin.hooks), [
    'before:aws:package:finalize:mergeCustomProviderResources',
    'before:remove:remove',
  ]);
});

test('throws if unable to find domain name', t => {
  t.context.plugin.serverless.service.custom.domain = {};
  t.throws(() => {
    t.context.plugin.beforePackage();
  });
})

test('throws if unable to find ApiGatewayDeployment', t => {
  t.context.plugin.serverless.service.custom.domain = 'foo.com';

  t.throws(() => {
    t.context.plugin.beforePackage();
  });
});

test('throws if serverless is wrong versino', t => {
  const e = t.throws(() => {
    t.context.plugin = new Plugin({
     version: '1.10.0'
   });
  });

  t.true(e.message.indexOf('requires serverless') !== -1);
});
