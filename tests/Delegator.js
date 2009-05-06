dojo.provide('aiki.tests.Delegator');
dojo.require('aiki.Delegator');

(function() {

   dojo.declare('aiki.tests.Delegator.Logger', null, {
     constructor: function() {
       this.log = [];
     },
     m1: function() {
       this.log.push(['m1', arguments]);
     },
     m2: function() {
       this.log.push(['m2', arguments]);
     },
     apiMethod: function() {
       this.log.push(['apiMethod', arguments]);
     },
     check: function(expectedCalls) {
       doh.is(expectedCalls.length, this.log.length, 'Unexpected call count.');
       for (var i = 0, l = expectedCalls.length; i < l; i++) {
         var expected = expectedCalls[i];
         var actual   = this.log[i];
         doh.is(expected[0], actual[0], "Unexpected method name for call " + i + ".");
         doh.is(expected[1], actual[1], "Unexpected arguments for call " + i + ".");
       }
     }
   });

   dojo.declare('aiki.tests.Delegator.API', null, {
     apiMethod: function() {
     },
     onSomething: function() {
     }
   });

   dojo.declare('aiki.tests.Delegator.Simple', [aiki.Delegator('logger', 'm1', 'm2')], {
     constructor: function(logger) {
       this.logger = logger;
     },
     passed: function() {
     }
   });

   dojo.declare('aiki.tests.Delegator.Renamed', aiki.Delegator('logger', ['m1', 'm2']), {
     constructor: function(logger) {
       this.logger = logger;
     }
   });

   dojo.declare('aiki.tests.Delegator.Apid', aiki.Delegator('logger', aiki.tests.Delegator.API), {
     constructor: function(logger) {
       this.logger = logger;
     }
   });

   dojo.declare('aiki.tests.Delegator.Fixture', null, {
     constructor: function(name, klass, test) {
       this.name  = name;
       this.klass = klass;
       this.runTest = test;
     },
     setUp: function() {
       this.logger = new aiki.tests.Delegator.Logger();
       this.obj = new this.klass(this.logger);
     }
   });

   doh.register("aiki.tests.Delegator",
     [
       new aiki.tests.Delegator.Fixture(
         'delegates methods to methods of the same name',
         aiki.tests.Delegator.Simple,
         function (t) {
           this.obj.m1('a', 'b', 'c');
           this.obj.m2(1, 2);
           this.logger.check([
             ['m1', ['a', 'b', 'c']],
             ['m2', [1, 2]]
           ]);
         }
       ),

       new aiki.tests.Delegator.Fixture(
         "doesn't notice call of undelegated method",
         aiki.tests.Delegator.Simple,
         function(t) {
           this.obj.passed();
           this.logger.check([]);
         }
       ),

       new aiki.tests.Delegator.Fixture(
         "delegates method to explicitly given method",
         aiki.tests.Delegator.Renamed,
         function(t) {
           this.obj.m1('a', 'b', 'c');
           this.logger.check([
             ['m2', ['a', 'b', 'c']]
           ]);
         }
       ),

       new aiki.tests.Delegator.Fixture(
         "delegates API method",
         aiki.tests.Delegator.Apid,
         function(t) {
           this.obj.apiMethod('foo');
           this.logger.check([
             ['apiMethod', ['foo']]
           ]);
         }
       ),

       new aiki.tests.Delegator.Fixture(
         "doesn't delegate event method",
         aiki.tests.Delegator.Apid,
         function(t) {
           t.assertError(TypeError, this.obj, 'onSomething');
         }
       )
     ]
   );
 })();
