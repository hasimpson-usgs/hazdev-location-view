/* global define */
define([
	'leaflet'
], function (
	L
) {

	'use strict';

	var getCoordinateControlMethod = function () {
		return 'confidence-control';
	};

	var DEFAULTS = {
		'location': {
			'place': null,
			'longitude': 0,
			'latitude': 0,
			'method': getCoordinateControlMethod(),
			'confidence':null,
			'accuracy': null
		},
		'position': 'topleft'
	};

	var CoordinateControl =  L.Control.extend({
		includes: L.Mixin.Events,

		initialize: function (options) {
			L.Util.setOptions(this, L.Util.extend({}, DEFAULTS, options));
			this._location = this.options.location || null;
		},

		onAdd: function (map) {

			this._map = map;

			var control = L.DomUtil.create('div', 'leaflet-coordinate-control');
			control.title = 'Location Using Latitude/ Longitude';
			control.innerHTML = [
					'<form>',
						'<label for="latitude">Latitude</label>',
						'<input type="number" name="latitude" id="latitude" min="-90" max="90" />',
						'<label for="latitude">Longitude</label>',
						'<input type="number" name="longitude" id="longitude" min="-360" max="360" />',
						'<button type="submit" id="coordinate-submit">',
					'</form>'
			].join('');

			this._latitude = control.querySelector('#latitude');
			this._longitude = control.querySelector('#longitude');

			// Bind to a submit button click
			this._submit = control.querySelector('#coordinate-submit');
			L.DomEvent.addListener(this._submit , 'click', this._onSubmit, this);

			return control;
		},

		onRemove: function () {
			this._map = null;
		},

		setLocation: function (location, options) {

			this._location = location;

			if (options && options.hasOwnProperty('silent') &&
					options.silent !== true) {
				this.fire('location', this._location);
			}
		},

		getLocation: function () {
			return this._location;
		},

		_onSubmit: function () {
			return this.setLocation(
					this._getCoordinateLocation(
							this._latitude.value,
							this._longitude.value
					)
			);
		},

		_getCoordinateLocation: function(latitude, longitude) {
			return {
				'place': null,
				'longitude': longitude,
				'latitude': latitude,
				'method': getCoordinateControlMethod(),
				'confidence':this._getConfidenceLevel(), // TODO
				'accuracy': null // TODO
			};
		},

		_getConfidenceLevel: function () {
			return 'confidence';
		}

	});

	// expose the coordinate control method type
	CoordinateControl.METHOD = getCoordinateControlMethod();

	return CoordinateControl;

});