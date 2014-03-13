/* global define, describe, it, before, after */
define([
	'chai',
	'sinon',

	'LocationView'
], function (
	chai,
	sinon,

	LocationView
) {
	'use strict';
	var expect = chai.expect;

	describe('LocationView test suite', function () {

		describe('Constructor', function () {
			it('Can be required.', function () {
				/* jshint -W030 */
				expect(LocationView).to.not.be.null;
				/* jshint +W030 */
			});

			it('Can be instantiated.', function () {
				var l = new LocationView();
				expect(l).to.be.an.instanceof(LocationView);
			});

			it('Has all expected methods.', function () {
				var l = new LocationView();

				expect(l).to.respondTo('_createMap');
				expect(l).to.respondTo('_createModal');
				expect(l).to.respondTo('show');
				expect(l).to.respondTo('_updateMap');
			});

			it('Has all expected properties.', function () {
				var l = new LocationView();

				expect(l).to.have.property('_map');
				expect(l).to.have.property('_mapContainer');
				expect(l).to.have.property('_locationControl');

				expect(l).to.have.property('_modal');
			});
		});

		describe('show', function () {
			var l = new LocationView(),
			    modalShowSpy = sinon.spy(l._modal, 'show'),
			    updateMapSpy = sinon.spy(l, '_updateMap');

			before(function () {
				l.show();
			});

			it('Calls the modal show method.', function () {
				expect(modalShowSpy.callCount).to.equal(1);
			});

			it('Calls the _updateMap method.', function () {
				expect(updateMapSpy.callCount).to.equal(1);
			});

			it('Has been added to the DOM.', function () {
				expect(document.querySelectorAll('.modal').length).to.equal(1);
			});

			after(function () {
				l._modal.hide();
			});
		});


		describe('_updateMap', function () {
			var l = new LocationView();

			it('Honors the extent property.', function () {
				var fitBoundsSpy = sinon.spy(l._map, 'fitBounds'),
				    usaExtent = [[50.0, -125.0], [24.6, -65.0]];

				l._updateMap();
				expect(fitBoundsSpy.callCount).to.equal(1);
				/* jshint -W030 */
				expect(fitBoundsSpy.firstCall.calledWithExactly(
						[[70.0, -170.0], [-50.0, 170.0]])).to.be.true;
				/* jshint +W030 */

				l._updateMap({extent: usaExtent});
				expect(fitBoundsSpy.callCount).to.equal(2);
				/* jshint -W030 */
				expect(fitBoundsSpy.secondCall.calledWithExactly(usaExtent)).to.be.true;
				/* jshint +W030 */

				fitBoundsSpy.restore();
			});

			it('Honors the initialLocation property.', function () {
				var setLocSpy = sinon.spy(l._locationControl, 'setLocation');

				l._updateMap();
				expect(setLocSpy.callCount).to.equal(0);

				l._updateMap({initialLocation: {}});
				expect(setLocSpy.callCount).to.equal(0);

				l._updateMap({initialLocation: {latitude: 0}});
				expect(setLocSpy.callCount).to.equal(0);

				l._updateMap({initialLocation: {latitude:0, longitude:0}});
				expect(setLocSpy.callCount).to.equal(0);

				l._updateMap({initialLocation: {latitude:0, longitude:0,
						place:null}});
				expect(setLocSpy.callCount).to.equal(0);

				l._updateMap({initialLocation: {latitude:0, longitude:0,
						place:null, method:null}});
				expect(setLocSpy.callCount).to.equal(0);

				l._updateMap({initialLocation: {latitude:0, longitude:0,
						place:null, method:null, confidence:null}});
				expect(setLocSpy.callCount).to.equal(0);

				l._updateMap({initialLocation: {latitude:0, longitude:0,
						place:null, method:null, confidence:null, accuracy:null}});
				expect(setLocSpy.callCount).to.equal(1);

				setLocSpy.restore();
			});

		});

	});

});
