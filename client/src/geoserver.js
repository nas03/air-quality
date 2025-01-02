// var map = L.map('map').setView([17.9459, 105.97], 6);
import 'iso8601';
import L from 'leaflet';
/* import 'leaflet-timedimension';
import 'leaflet-timedimension/dist/leaflet.timedimension.control.min.css'; */
import 'leaflet/dist/leaflet.css';
import './geoserver.css';

var map = L.map('map', {
	zoom: 6,
	zoomControl: false,
	preferCanvas: true,
	center: [17.9459, 105.97],
	/* timeDimension: false,
	timeDimensionOptions: {
		timeInterval: '2009-10-01/2009-12-01',
		period: 'P1M',
	},
	timeDimensionControl: true, */
});

/* Map Control Customize START */
L.control.zoom({ position: 'topright' }).addTo(map);

// span for focus control
const focusControlSpan = document.createElement('span');
focusControlSpan.setAttribute('aria-hidden', 'true');
focusControlSpan.style.fontSize = '17px';
focusControlSpan.style.lineHeight = '30px';
focusControlSpan.classList.add('fa-solid', 'fa-expand');

// focus control
const focusControl = document.createElement('a');
focusControl.appendChild(focusControlSpan);
focusControl.classList.add('zoom-control-focus');
focusControl.addEventListener('click', () => {
	map.setZoom(8);
});
document.querySelector('.leaflet-control-zoom').prepend(focusControl);
/* Map Control Customize END */

/* Map Config START */
L.tileLayer(
	'https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}.png?key=Y2LLlbvRVwaYxT2YxjWV',
	{
		attribution:
			'\u003ca href="https://www.maptiler.com/copyright/" target="_blank"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href="https://www.openstreetmap.org/copyright" target="_blank"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e',
	}
).addTo(map);
/* Map config END */

/* WMS Layer START */
const wmsLayer = L.tileLayer.wms('http://localhost:8080/geoserver/air/wms', {
	layers: 'air:precipitation',
	format: 'image/png',
	transparent: true,
	opacity: 0.8,
});
wmsLayer.wmsParams.time = '2009-10-01';

wmsLayer.addTo(map);
/* WMS Layer END*/
