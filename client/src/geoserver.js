// var map = L.map('map').setView([17.9459, 105.97], 6);
import 'iso8601';
import L from 'leaflet';
import 'leaflet-timedimension';
import 'leaflet-timedimension/dist/leaflet.timedimension.control.min.css';
import 'leaflet/dist/leaflet.css';

var map = L.map('map', {
	zoom: 6,
	preferCanvas: true,
	center: [17.9459, 105.97],
	timeDimension: true,
	timeDimensionOptions: {
		timeInterval: '2009-10-01/2009-12-01',
		period: 'P1M',
	},
	timeDimensionControl: true,
});
L.tileLayer(
	'https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}.png?key=Y2LLlbvRVwaYxT2YxjWV',
	{
		attribution:
			'\u003ca href="https://www.maptiler.com/copyright/" target="_blank"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href="https://www.openstreetmap.org/copyright" target="_blank"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e',
	}
).addTo(map);

const wmsLayer = L.tileLayer.wms('http://localhost:8080/geoserver/air/wms', {
	layers: 'air:precipitation',
	format: 'image/png',
	transparent: true,
	opacity: 0.8,
});

var tdWmsLayer = L.timeDimension.layer.wms(wmsLayer);
tdWmsLayer.addTo(map);
